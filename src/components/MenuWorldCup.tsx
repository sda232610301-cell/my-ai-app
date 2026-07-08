import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, ArrowLeft, RefreshCw, Award, CheckCircle, Trash2 } from "lucide-react";

interface MenuWorldCupProps {
  onClose: () => void;
}

interface WorldCupQuestion {
  id: number;
  optionA: string;
  optionB: string;
}

const QUESTIONS: WorldCupQuestion[] = [
  { id: 1, optionA: "떡볶이", optionB: "스파게티" },
  { id: 2, optionA: "마라탕", optionB: "짜장면" },
  { id: 3, optionA: "삼겹살구이", optionB: "양념치킨" },
  { id: 4, optionA: "피자", optionB: "햄버거" },
  { id: 5, optionA: "우육탕면", optionB: "라멘" }
];

const ALL_FOOD_ITEMS = [
  "떡볶이",
  "스파게티",
  "마라탕",
  "짜장면",
  "삼겹살구이",
  "양념치킨",
  "피자",
  "햄버거",
  "우육탕면",
  "라멘"
];

const LOCAL_STORAGE_KEY = "mealmate_worldcup_votes_v5";

export default function MenuWorldCup({ onClose }: MenuWorldCupProps) {
  // 전역/누적 투표 기록 불러오기
  const [allVotes, setAllVotes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 누락된 항목 방어 코드
        const merged = { ...parsed };
        ALL_FOOD_ITEMS.forEach((item) => {
          if (typeof merged[item] !== "number") {
            merged[item] = 0;
          }
        });
        return merged;
      } catch (e) {
        // ignore
      }
    }
    const fresh: Record<string, number> = {};
    ALL_FOOD_ITEMS.forEach((item) => {
      fresh[item] = 0;
    });
    return fresh;
  });

  // 상태 관리
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [sessionSelections, setSessionSelections] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // 게임 시작
  const startWorldCup = () => {
    setIsPlaying(true);
    setCurrentQuestionIdx(0);
    setSessionSelections([]);
    setIsFinished(false);
  };

  // 음식 선택 핸들러
  const handleSelect = (selectedFood: string) => {
    const updatedSelections = [...sessionSelections, selectedFood];
    setSessionSelections(updatedSelections);

    // 누적 투표수 증가 및 로컬 저장
    const updatedVotes = {
      ...allVotes,
      [selectedFood]: (allVotes[selectedFood] || 0) + 1
    };
    setAllVotes(updatedVotes);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedVotes));

    // 다음 질문으로 이동 또는 완료
    if (currentQuestionIdx + 1 < QUESTIONS.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      setIsFinished(true);
    }
  };

  // 가장 누적 득표수가 높은 최다 선택 메뉴 계산
  const getMostSelectedMenu = () => {
    let bestFood = "";
    let maxVotes = -1;
    ALL_FOOD_ITEMS.forEach((food) => {
      const votes = allVotes[food] || 0;
      if (votes > maxVotes) {
        maxVotes = votes;
        bestFood = food;
      } else if (votes === maxVotes && maxVotes > 0) {
        // 동률일 경우 이번 세션에서 선택한 것에 우선순위 부여
        if (sessionSelections.includes(food) && !sessionSelections.includes(bestFood)) {
          bestFood = food;
        }
      }
    });
    return { name: bestFood, count: maxVotes };
  };

  const mostSelected = getMostSelectedMenu();

  // 역대 데이터 완전 초기화
  const handleResetData = () => {
    if (window.confirm("이상형 월드컵의 역대 선택 데이터를 모두 삭제하시겠습니까?")) {
      const fresh: Record<string, number> = {};
      ALL_FOOD_ITEMS.forEach((item) => {
        fresh[item] = 0;
      });
      setAllVotes(fresh);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fresh));
      setIsFinished(false);
      setIsPlaying(false);
    }
  };

  // 랭킹 정렬 (선택 횟수가 있는 경우만 또는 전체)
  const sortedLeaderboard = ALL_FOOD_ITEMS.map((item) => ({
    name: item,
    count: allVotes[item] || 0
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="flex flex-col h-full text-slate-800" id="worldcup-root">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors cursor-pointer font-bold"
          id="btn-back-to-plate"
        >
          <ArrowLeft size={16} />
          <span>식판으로 돌아가기</span>
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="text-blue-600" size={20} />
          <h2 className="text-lg font-extrabold text-slate-800 font-sans tracking-tight">급식 이상형 월드컵</h2>
        </div>
        <div className="w-16"></div>
      </div>

      {!isPlaying && !isFinished ? (
        // 1. 대기/시작 화면
        <div className="flex flex-col justify-between flex-1 overflow-y-auto pr-1">
          <div className="text-center my-auto py-6">
            <span className="inline-block bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-bold mb-3">
              미니 게임
            </span>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">최애 급식 메뉴 이상형 월드컵</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto font-medium">
              대표적인 급식 대결 질문 5가지에 답해보세요! 다른 친구들의 누적 선택 기록을 바탕으로 역대 최고의 이상형 메뉴를 알려드립니다.
            </p>
          </div>

          {/* 역대 랭킹 보드 */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-slate-700 tracking-wider flex items-center gap-1.5">
                <Award size={14} className="text-blue-600" />
                <span>내가 선택한 메뉴 실시간 누적 현황</span>
              </h4>
              {sortedLeaderboard.some((x) => x.count > 0) && (
                <button
                  onClick={handleResetData}
                  className="text-[10px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-0.5 cursor-pointer"
                  title="데이터 초기화"
                >
                  <Trash2 size={10} />
                  <span>선택 기록 초기화</span>
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {sortedLeaderboard.map((item, index) => {
                const hasVotes = item.count > 0;
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-slate-100 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-500">
                        {index + 1}
                      </span>
                      <span className="font-bold text-xs md:text-sm text-slate-800">{item.name}</span>
                    </div>
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md ${
                      hasVotes ? "text-blue-600 bg-blue-50 border border-blue-100" : "text-slate-300 bg-slate-50"
                    }`}>
                      {item.count}회 선택됨
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={startWorldCup}
            className="w-full bg-blue-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            id="btn-start-worldcup"
          >
            <Trophy size={18} />
            <span>이상형 월드컵 시작하기</span>
          </button>
        </div>
      ) : isPlaying ? (
        // 2. 진행 화면 (5개 질문)
        <div className="flex flex-col flex-1 justify-between">
          <div className="text-center mb-4">
            <span className="bg-emerald-600 text-white text-xs px-3.5 py-1 rounded-full font-extrabold tracking-wider shadow-sm">
              질문 {currentQuestionIdx + 1} / {QUESTIONS.length}
            </span>
            <h3 className="text-lg font-bold text-slate-800 mt-3">둘 중 더 먹고 싶은 급식을 터치하세요!</h3>
          </div>

          {/* 대결 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto relative">
            {/* 옵션 A */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(QUESTIONS[currentQuestionIdx].optionA)}
              className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-center items-center h-[160px] p-6 text-center"
              id={`option-a-${currentQuestionIdx}`}
            >
              <div className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full z-20 shadow-xs">
                선택지 A
              </div>
              <span className="font-extrabold text-lg md:text-xl text-slate-800 group-hover:text-blue-600 transition-colors">
                {QUESTIONS[currentQuestionIdx].optionA}
              </span>
            </motion.div>

            {/* VS 구분 기호 */}
            <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-slate-900 border-4 border-white flex items-center justify-center text-white font-black text-xs shadow-md pointer-events-none italic">
              VS
            </div>

            {/* 옵션 B */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(QUESTIONS[currentQuestionIdx].optionB)}
              className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-center items-center h-[160px] p-6 text-center"
              id={`option-b-${currentQuestionIdx}`}
            >
              <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full z-20 shadow-xs">
                선택지 B
              </div>
              <span className="font-extrabold text-lg md:text-xl text-slate-800 group-hover:text-emerald-600 transition-colors">
                {QUESTIONS[currentQuestionIdx].optionB}
              </span>
            </motion.div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                if (window.confirm("이상형 월드컵을 그만두고 돌아가시겠습니까?")) {
                  setIsPlaying(false);
                }
              }}
              className="text-xs text-slate-400 underline hover:text-rose-500 cursor-pointer font-bold"
            >
              기권하고 메인으로 가기
            </button>
          </div>
        </div>
      ) : (
        // 3. 완료 결과 화면
        <div className="flex flex-col flex-1 justify-between overflow-y-auto pr-1 text-center">
          <div className="my-auto py-4 space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-400 mb-1"
            >
              <Trophy className="text-blue-600" size={32} />
            </motion.div>

            <div>
              <span className="text-blue-600 text-xs font-black tracking-widest uppercase">
                🎉 월드컵 결과 분석 완료 🎉
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
                나의 이상형 선택 완료!
              </h3>
            </div>

            {/* 이번 라운드 선택 결과 요약 */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 max-w-md mx-auto text-left">
              <span className="text-xxs font-extrabold text-blue-600 uppercase tracking-wider block mb-2">
                이번 라운드 나의 Pick 5가지
              </span>
              <div className="flex flex-wrap gap-2">
                {sessionSelections.map((food, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-blue-200 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1"
                  >
                    <CheckCircle size={10} className="text-blue-500" />
                    <span>{food}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 실시간 1위 가이드 */}
            {mostSelected.count > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 max-w-md mx-auto text-center shadow-xs">
                <span className="text-xxs font-extrabold text-amber-700 uppercase tracking-wider block mb-1">
                  👑 역대 최다 선택 1위 메뉴 👑
                </span>
                <p className="text-xl font-black text-amber-900 tracking-tight">
                  {mostSelected.name}
                </p>
                <p className="text-[11px] text-amber-600 font-bold mt-1.5">
                  총 <span className="text-sm underline font-black">{mostSelected.count}회</span>의 최다 선택을 기록하며 전체 급식 1위에 올라 있습니다!
                </p>
              </div>
            )}

            {/* 실시간 전체 순위 요약 리스트 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left">
              <span className="text-xxs font-extrabold text-slate-500 uppercase tracking-wider block mb-2.5">
                실시간 누적 전체 순위 현황
              </span>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                {sortedLeaderboard.map((item, idx) => (
                  <div key={item.name} className="flex justify-between items-center text-xs font-bold py-1 border-b border-slate-100 last:border-0">
                    <span className="text-slate-500">
                      {idx + 1}. {item.name}
                    </span>
                    <span className="text-blue-600">{item.count}회</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={startWorldCup}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer border border-slate-200"
            >
              <RefreshCw size={14} />
              <span>다시 도전하기</span>
            </button>
            <button
              onClick={() => {
                setIsFinished(false);
                setIsPlaying(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs shadow-sm cursor-pointer"
            >
              <span>랭킹판 확인하기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
