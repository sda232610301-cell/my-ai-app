import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Review } from "../types";
import { initialReviews } from "../data";
import { Star, MessageSquarePlus, ArrowLeft, ThumbsUp, Send, User, Award, Flame } from "lucide-react";

interface TodayReviewProps {
  onClose: () => void;
}

export default function TodayReview({ onClose }: TodayReviewProps) {
  // localStorage에서 후기 목록 가져오기 혹은 초기 후기 리스트 사용
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("mealmate_user_reviews_v5");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialReviews;
      }
    }
    return initialReviews;
  });

  // 내가 방금 작성한 글 여부 체크용 (제출 완료 화면 전환)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    return localStorage.getItem("mealmate_has_submitted_review_v5") === "true";
  });

  // 입력 폼 상태
  const [nickname, setNickname] = useState("");
  const [grade, setGrade] = useState<number>(1);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 별점 클릭 핸들러
  const handleSetRating = (stars: number) => {
    setRating(stars);
  };

  // 후기 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setErrorMessage("닉네임을 입력해 주세요!");
      return;
    }
    if (!comment.trim()) {
      setErrorMessage("후기 내용을 입력해 주세요!");
      return;
    }
    if (comment.length < 5) {
      setErrorMessage("후기는 5글자 이상 정성스럽게 써주세요!");
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: nickname.trim(),
      grade: grade,
      rating: rating,
      comment: comment.trim(),
      createdAt: "방금 전",
      likes: 0
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    setIsSubmitted(true);
    setErrorMessage("");

    // 로컬 저장
    localStorage.setItem("mealmate_user_reviews_v5", JSON.stringify(updatedReviews));
    localStorage.setItem("mealmate_has_submitted_review_v5", "true");

    // 폼 초기화
    setComment("");
  };

  // 좋아요 누르기 핸들러
  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = reviews.map((rev) =>
      rev.id === id ? { ...rev, likes: rev.likes + 1 } : rev
    );
    setReviews(updated);
    localStorage.setItem("mealmate_user_reviews_v5", JSON.stringify(updated));
  };

  // 평균 별점 계산
  const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
  const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "0.0";

  // 별점 카운트 계산
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((rev) => {
    const r = Math.round(rev.rating) as 1 | 2 | 3 | 4 | 5;
    if (ratingCounts[r] !== undefined) {
      ratingCounts[r]++;
    }
  });

  return (
    <div className="flex flex-col h-full text-slate-800" id="review-container">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
          id="btn-back-to-plate-review"
        >
          <ArrowLeft size={16} />
          <span>식판으로 돌아가기</span>
        </button>
        <div className="flex items-center gap-2">
          <MessageSquarePlus className="text-blue-600" size={20} />
          <h2 className="text-lg font-bold text-slate-800 font-sans tracking-tight">오늘의 급식 후기</h2>
        </div>
        <div className="w-16"></div> {/* Spacer */}
      </div>

      <div className="flex flex-col md:flex-row gap-5 flex-1 overflow-hidden">
        {/* 왼쪽 사이드바: 평점 요약 및 등록 폼 */}
        <div className="w-full md:w-[320px] flex flex-col gap-4 overflow-y-auto pr-1">
          {/* 평점 카드 */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center">
            <span className="text-[10px] text-blue-600 font-bold bg-white px-2.5 py-1 rounded-full shadow-sm mb-1 inline-block border border-blue-50">
              🔥 실시간 급식 맛 등급
            </span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-3xl font-black text-slate-950 font-mono">{averageRating}</span>
              <div className="flex flex-col items-start">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(Number(averageRating)) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">평가 {reviews.length}명 참여 중</span>
              </div>
            </div>

            {/* 평점 분포 */}
            <div className="mt-3.5 space-y-1 text-xxs text-slate-500">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars as 1 | 2 | 3 | 4 | 5];
                const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-6 text-right font-bold">{stars}점</span>
                    <div className="flex-1 bg-white h-1.5 rounded-full overflow-hidden border border-slate-100">
                      <div className="bg-blue-500 h-full" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="w-6 text-left">{count}명</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 후기 작성 폼 */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex-1">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
              <Send size={15} className="text-blue-600" />
              <span>급식 한 줄 후기 남기기</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* 학년 선택 */}
              <div>
                <label className="block text-xxs font-bold text-slate-400 mb-1">학년 선택</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGrade(g)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        grade === g
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-100"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {g}학년
                    </button>
                  ))}
                </div>
              </div>

              {/* 닉네임 */}
              <div>
                <label className="block text-xxs font-bold text-slate-400 mb-1">닉네임</label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-[10px] text-slate-400" />
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value.slice(0, 10))}
                    placeholder="예: 급식먹는 백종원"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              {/* 별점 */}
              <div>
                <label className="block text-xxs font-bold text-slate-400 mb-1">오늘 급식 별점</label>
                <div className="flex gap-1 justify-center py-1">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      type="button"
                      key={stars}
                      onClick={() => handleSetRating(stars)}
                      className="text-amber-400 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Star
                        size={22}
                        className={stars <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 한줄 후기 */}
              <div>
                <label className="block text-xxs font-bold text-slate-400 mb-1">급식 한줄 평</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 80))}
                  placeholder="예: 오늘 삼겹살 볶음밥 고기 양 짱 많고 짱 맛있어요!"
                  rows={3}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-semibold resize-none"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xxs text-slate-400">{comment.length}/80자</span>
                  {errorMessage && <span className="text-xxs text-red-500 font-bold">{errorMessage}</span>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white font-bold py-2.5 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send size={13} />
                <span>후기 제출하기</span>
              </button>
            </form>

            {isSubmitted && (
              <div className="mt-3 bg-emerald-50 text-emerald-800 text-xxs p-2 rounded-lg border border-emerald-100 flex justify-between items-center">
                <span>내가 쓴 후기가 반영되었습니다!</span>
                <button
                  onClick={() => {
                    localStorage.removeItem("mealmate_has_submitted_review");
                    setIsSubmitted(false);
                  }}
                  className="underline font-bold hover:text-emerald-950 cursor-pointer"
                >
                  새로 쓰기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 영역: 실시간 다른 친구들의 후기 목록 */}
        <div className="flex-1 flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Flame size={16} className="text-blue-600" />
              <span>친구들의 생생한 한줄 리뷰</span>
            </h3>
            <span className="text-xxs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              실시간 정렬
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[420px]" id="reviews-feed">
            {reviews.map((rev) => (
              <motion.div
                key={rev.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* 작성자 정보 */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {rev.grade}학년
                    </span>
                    <span className="font-bold text-xs text-slate-800">{rev.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                        />
                      ))}
                    </div>
                    <span className="text-xxs text-slate-400 ml-1">{rev.createdAt}</span>
                  </div>
                </div>

                {/* 후기 내용 */}
                <p className="text-xs text-slate-600 font-medium leading-relaxed text-left whitespace-pre-wrap">
                  {rev.comment}
                </p>

                {/* 인터랙션 버튼 (좋아요) */}
                <div className="flex justify-end border-t border-slate-50 pt-2 mt-1">
                  <button
                    onClick={(e) => handleLike(rev.id, e)}
                    className="flex items-center gap-1 text-xxs text-slate-400 hover:text-blue-600 font-semibold transition-colors cursor-pointer"
                  >
                    <ThumbsUp size={12} />
                    <span>추천 ({rev.likes})</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-3 flex justify-between items-center text-xxs text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span>💡 욕설이나 불쾌한 코멘트는 필터링되며, 건강한 급식실 문화를 지켜주세요!</span>
            <button
              onClick={() => {
                if (window.confirm("친구들의 후기 데이터를 초기화하시겠습니까? (테스트용)")) {
                  localStorage.removeItem("mealmate_user_reviews_v5");
                  localStorage.removeItem("mealmate_has_submitted_review_v5");
                  setReviews(initialReviews);
                  setIsSubmitted(false);
                }
              }}
              className="underline text-slate-400 hover:text-blue-600 cursor-pointer font-semibold whitespace-nowrap ml-2"
            >
              리셋
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
