import React, { useState } from "react";
import { motion } from "motion/react";
import { FoodMenu } from "../types";
import { initialMonthlyVoteCandidates } from "../data";
import { Vote, ArrowLeft, Check, Award, Heart } from "lucide-react";

interface MonthlyVoteProps {
  onClose: () => void;
}

export default function MonthlyVote({ onClose }: MonthlyVoteProps) {
  // localStorage를 이용하여 투표 목록 관리 및 투표 완료 여부 체크
  const [candidates, setCandidates] = useState<FoodMenu[]>(() => {
    const saved = localStorage.getItem("mealmate_monthly_votes_v5");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialMonthlyVoteCandidates;
      }
    }
    return initialMonthlyVoteCandidates;
  });

  const [hasVoted, setHasVoted] = useState<boolean>(() => {
    return localStorage.getItem("mealmate_has_voted_monthly_v5") === "true";
  });

  const [votedId, setVotedId] = useState<string | null>(() => {
    return localStorage.getItem("mealmate_voted_id_v5");
  });

  // 투표 실행
  const handleVote = (id: string) => {
    if (hasVoted) return;

    const updated = candidates.map((item) =>
      item.id === id ? { ...item, votes: item.votes + 1 } : item
    );

    setCandidates(updated);
    setHasVoted(true);
    setVotedId(id);

    localStorage.setItem("mealmate_monthly_votes_v5", JSON.stringify(updated));
    localStorage.setItem("mealmate_has_voted_monthly_v5", "true");
    localStorage.setItem("mealmate_voted_id_v5", id);
  };

  // 총 투표수 계산
  const totalVotes = candidates.reduce((sum, item) => sum + item.votes, 0);

  // 최고 득표수 찾기
  const maxVotes = Math.max(...candidates.map((item) => item.votes));

  // 득표순 정렬
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

  return (
    <div className="flex flex-col h-full text-slate-800" id="vote-container">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
          id="btn-back-to-plate-vote"
        >
          <ArrowLeft size={16} />
          <span>식판으로 돌아가기</span>
        </button>
        <div className="flex items-center gap-2">
          <Vote className="text-blue-600" size={20} />
          <h2 className="text-lg font-bold text-slate-800 font-sans tracking-tight">이달의 급식 투표</h2>
        </div>
        <div className="w-16"></div> {/* Spacer */}
      </div>

      <div className="flex flex-col justify-between flex-1 overflow-y-auto pr-1">
        {/* 설명 */}
        <div className="text-center mb-5">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold mb-2">
            📊 이달의 급식 왕을 가려라!
          </span>
          <h3 className="text-xl font-bold text-slate-900 mb-1">우리학교 최고 급식 메뉴 투표</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            최근 한 달 동안 나온 급식 메뉴 중 가장 맛있었던 '최애 조합'에 투표해 주세요! 영양사 선생님께 실시간 반영됩니다.
          </p>
        </div>

        {!hasVoted ? (
          // 투표 이전: 카드 형식 리스트
          <div className="space-y-3 mb-6" id="vote-options-list">
            {candidates.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.01, border: "1px solid #2563eb" }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleVote(item.id)}
                className="flex items-center gap-4 bg-white hover:bg-slate-50/40 p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-xl text-2xl shadow-sm shadow-blue-100">
                  {item.image || "🍱"}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-xs md:text-sm text-slate-800 leading-tight">
                    {item.name}
                  </h4>
                  <span className="text-xxs text-slate-400 mt-1 block">현재 {item.votes}표 득표 중</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                  <Check size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // 투표 이후: 실시간 투표 차트 보기
          <div className="space-y-4 mb-6" id="vote-results-list">
            <div className="bg-blue-50/50 border border-blue-200/40 rounded-2xl p-4 text-center mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-blue-800 font-bold mb-1">
                <Heart size={14} className="fill-blue-500 text-blue-500" />
                <span>투표에 성공적으로 참여했습니다!</span>
              </span>
              <p className="text-xxs text-blue-700/80">
                여러분이 참여해 주신 투표 결과는 실시간으로 누적 반영되었습니다.
              </p>
            </div>

            <div className="space-y-3.5">
              {sortedCandidates.map((item, index) => {
                const percentage = totalVotes > 0 ? Math.round((item.votes / totalVotes) * 100) : 0;
                const isWinner = item.votes === maxVotes;
                const isMyVote = item.id === votedId;

                return (
                  <div key={item.id} className="relative bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    {/* 정보행 */}
                    <div className="flex justify-between items-center mb-1.5 z-10 relative">
                      <div className="flex items-center gap-2">
                        {isWinner && (
                          <span className="bg-blue-100 text-blue-800 text-xxs font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                            <Award size={11} className="fill-blue-400 text-blue-500" />
                            <span>1위</span>
                          </span>
                        )}
                        {isMyVote && (
                          <span className="bg-blue-600 text-white text-xxs font-extrabold px-1.5 py-0.5 rounded-md">
                            내 선택
                          </span>
                        )}
                        <span className="font-bold text-xs text-slate-800 leading-snug line-clamp-1">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-700 whitespace-nowrap ml-2">
                        {percentage}% <span className="text-xxs text-slate-400 font-normal">({item.votes}표)</span>
                      </span>
                    </div>

                    {/* 백그라운드 프로그레스 바 */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          isWinner
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                            : "bg-slate-300"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center text-xxs text-slate-400">
              총 {totalVotes}명의 친구들이 투표에 참여해 주었습니다.
            </div>
          </div>
        )}

        {hasVoted && (
          <button
            onClick={() => {
              // 개발 테스트용 혹은 재투표용 초기화 버튼
              if (window.confirm("투표를 다시 진행하시겠습니까? (테스트용)")) {
                localStorage.removeItem("mealmate_has_voted_monthly_v5");
                localStorage.removeItem("mealmate_voted_id_v5");
                localStorage.removeItem("mealmate_monthly_votes_v5");
                setCandidates(initialMonthlyVoteCandidates);
                setHasVoted(false);
                setVotedId(null);
              }
            }}
            className="w-full py-2.5 border border-dashed border-slate-300 hover:border-blue-300 text-slate-400 hover:text-blue-600 transition-colors rounded-xl text-xxs font-semibold cursor-pointer mb-2"
          >
            기록 초기화하고 다시 투표해보기 (테스트용)
          </button>
        )}
      </div>
    </div>
  );
}
