import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import MealPlate from "./components/MealPlate";
import MenuWorldCup from "./components/MenuWorldCup";
import MonthlyVote from "./components/MonthlyVote";
import TodayReview from "./components/TodayReview";
import { initialReviews } from "./data";
import { Review } from "./types";
import { X, Sparkles } from "lucide-react";

export default function App() {
  const [activeFeature, setActiveFeature] = useState<"plate" | "worldcup" | "vote" | "review">("plate");

  // 메인 화면 배지 표시용 공통 상태들
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState("0.0");
  const [hasVoted, setHasVoted] = useState(false);

  // 로컬스토리지 데이터 변경 시 상위 배지 상태들을 최신화하는 함수
  const refreshStats = () => {
    // 1. 후기 데이터 분석
    const savedReviews = localStorage.getItem("mealmate_user_reviews_v5");
    let currentReviews: Review[] = initialReviews;
    if (savedReviews) {
      try {
        currentReviews = JSON.parse(savedReviews);
      } catch (e) {
        currentReviews = initialReviews;
      }
    }
    setReviewCount(currentReviews.length);
    const totalRating = currentReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = currentReviews.length > 0 ? (totalRating / currentReviews.length).toFixed(1) : "0.0";
    setAverageRating(avg);

    // 2. 이달의 메뉴 투표 참여 여부
    const voted = localStorage.getItem("mealmate_has_voted_monthly_v5") === "true";
    setHasVoted(voted);
  };

  // 마운트 시 및 기능 전환 완료 시 스탯 갱신
  useEffect(() => {
    refreshStats();
  }, [activeFeature]);

  // 기능 열기
  const handleOpenFeature = (feature: "worldcup" | "vote" | "review") => {
    setActiveFeature(feature);
  };

  // 기능 닫기
  const handleCloseFeature = () => {
    setActiveFeature("plate");
    refreshStats(); // 복귀할 때 배지 최신화
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-800 flex flex-col justify-center py-6 px-4 md:px-8 relative overflow-x-hidden select-none font-sans">
      {/* 귀여운 장식용 기하학적 백그라운드 요소들 */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* 메인 뷰: 급식판 */}
      {activeFeature === "plate" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <MealPlate
            onOpenFeature={handleOpenFeature}
            reviewCount={reviewCount}
            averageRating={averageRating}
            hasVoted={hasVoted}
          />
        </motion.div>
      )}

      {/* 모달 오버레이 구조 */}
      <AnimatePresence>
        {activeFeature !== "plate" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
            onClick={handleCloseFeature}
          >
            {/* 모달 메인 박스 */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-200 w-full max-w-3xl h-[90vh] md:h-[80vh] flex flex-col overflow-hidden relative"
              onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않게 보호
            >
              {/* 오른쪽 상단 절대 위치 닫기 버튼 */}
              <button
                onClick={handleCloseFeature}
                className="absolute right-5 top-5 p-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-500 rounded-full transition-all cursor-pointer z-50 animate-pulse"
                id="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* 스파클 데코레이션 */}
              <div className="absolute left-6 top-5 flex items-center gap-1.5 text-blue-600 opacity-80">
                <Sparkles size={16} />
                <span className="text-xxs font-bold tracking-wider uppercase">MEAL MATE PLAY</span>
              </div>

              {/* 콘텐츠 렌더링 패딩 공간 */}
              <div className="p-6 md:p-8 pt-12 md:pt-12 flex-1 overflow-y-auto">
                {activeFeature === "worldcup" && (
                  <MenuWorldCup onClose={handleCloseFeature} />
                )}
                {activeFeature === "vote" && (
                  <MonthlyVote onClose={handleCloseFeature} />
                )}
                {activeFeature === "review" && (
                  <TodayReview onClose={handleCloseFeature} />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
