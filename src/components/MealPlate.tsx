import React, { useState } from "react";
import { motion } from "motion/react";
import { Vote, Star, Trophy, Utensils, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { schoolLunchMenus } from "../data";

interface MealPlateProps {
  onOpenFeature: (feature: "worldcup" | "vote" | "review") => void;
  reviewCount: number;
  averageRating: string;
  hasVoted: boolean;
}

export default function MealPlate({
  onOpenFeature,
  reviewCount,
  averageRating,
  hasVoted
}: MealPlateProps) {
  const [activeMenuIdx, setActiveMenuIdx] = useState(0);
  const activeMenu = schoolLunchMenus[activeMenuIdx] || schoolLunchMenus[0];

  const handleNextMenu = () => {
    setActiveMenuIdx((prev) => (prev + 1) % schoolLunchMenus.length);
  };

  const handlePrevMenu = () => {
    setActiveMenuIdx((prev) => (prev - 1 + schoolLunchMenus.length) % schoolLunchMenus.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6" id="meal-plate-wrapper">
      {/* 식판 상단 안내바 (Geometric Balance 헤더 스타일) */}
      <header className="flex flex-col md:flex-row justify-between items-end mb-6 px-4 gap-4 text-slate-800">
        <div className="text-left">
          <h1 className="text-4xl font-black text-blue-600 tracking-tighter flex items-center gap-2">
            <Utensils className="text-blue-600" size={32} />
            <span>MEAL MATE</span>
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">School Lunch Companion</p>
        </div>
        <div className="text-right flex flex-col md:items-end">
          <div className="text-xs md:text-sm text-slate-400 font-medium">경연중학교 급식실 소통망</div>
        </div>
      </header>

      {/* 요약 현황 배지들 (기하학적 단색 스타일로 정제, 날짜/월드컵 관련 배지 완전 삭제) */}
      <div className="flex flex-wrap gap-2.5 mb-5 px-4 justify-start md:justify-end">
        <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5 text-xxs font-bold">
          <Vote size={12} className="text-emerald-500" />
          <span className="text-slate-500">이달의 투표:</span>
          <span className={hasVoted ? "text-emerald-600 font-extrabold" : "text-slate-500 font-semibold"}>
            {hasVoted ? "참여완료" : "미참여"}
          </span>
        </div>
        <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5 text-xxs font-bold">
          <Star size={12} className="text-blue-500 fill-blue-100" />
          <span className="text-slate-500">평균 평점:</span>
          <span className="text-blue-600 font-extrabold">{averageRating} ({reviewCount}명)</span>
        </div>
      </div>

      {/* 둥근 사각형 실제 급식판 컨셉의 컨테이너 (Geometric Balance: 60px 모서리, 은은한 플레이트 컬러, 8px 흰 테두리) */}
      <div
        className="relative bg-[#E2E8F0] rounded-[60px] p-6 md:p-8 shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)] border-8 border-white flex flex-col gap-6"
        id="stainless-plate"
      >
        {/* 내부 음각 효과를 주는 식판 테두리 */}
        <div className="absolute inset-2 border border-slate-300/40 rounded-[2.5rem] pointer-events-none" />

        {/* 위쪽 반찬 3개 칸 (작은 홀) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1번 홀: 이달의 메뉴 투표 */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenFeature("vote")}
            className="group relative cursor-pointer bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between h-44 transition-all"
            id="plate-hole-vote"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                <h3 className="font-bold text-base text-slate-800 group-hover:text-emerald-600 transition-colors">
                  이달의 메뉴 투표
                </h3>
              </div>
              <Vote className="text-slate-400 group-hover:text-emerald-500 transition-colors" size={20} />
            </div>

            <div className="text-left mt-2 flex-1 flex flex-col justify-center">
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                우리 학교 급식에 나온 가장 최고 맛있었던 메뉴를 뽑아주세요!
              </p>
            </div>

            <button className="w-full py-2 bg-slate-950 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
              {hasVoted ? "투표 결과 확인" : "내 최애 메뉴 투표"}
            </button>
          </motion.div>

          {/* 2번 홀: 오늘의 급식 후기 & 별점 */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenFeature("review")}
            className="group relative cursor-pointer bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between h-44 transition-all"
            id="plate-hole-review"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="font-bold text-base text-slate-800 group-hover:text-blue-600 transition-colors">
                  급식 후기 & 별점
                </h3>
              </div>
              <Star className="text-slate-400 group-hover:text-amber-500 transition-colors" size={20} />
            </div>

            <div className="text-left mt-2 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < Math.round(Number(averageRating)) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-600 font-mono">
                  {averageRating} 점
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">오늘 급식을 먹은 {reviewCount}명의 한마디 피드백!</p>
            </div>

            <button className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
              후기 쓰러 가기
            </button>
          </motion.div>

           {/* 3번 홀: 급식 이상형 월드컵 */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenFeature("worldcup")}
            className="group relative cursor-pointer bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between h-44 transition-all"
            id="plate-hole-worldcup"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                <h3 className="font-bold text-base text-slate-800 group-hover:text-emerald-600 transition-colors">
                  급식 이상형 월드컵
                </h3>
              </div>
              <Trophy className="text-slate-400 group-hover:text-emerald-500 transition-colors" size={20} />
            </div>

            <div className="text-left mt-2 flex-1 flex flex-col justify-center">
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                떡볶이 vs 스파게티, 마라탕 vs 짜장면! 내 최애 급식 메뉴를 선택해 보세요!
              </p>
            </div>

            <button className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors">
              월드컵 시작하기
            </button>
          </motion.div>
        </div>

        {/* 아래쪽 식단 정보 칸 (캘린더의 다채로운 특식 메뉴를 슬라이더 형태로 탐색 - 4번 월드컵 홀은 삭제 및 TODAY'S LUNCH 와이드 확장) */}
        <div className="grid grid-cols-1 gap-6">
          <div
            className="relative bg-white min-h-[260px] rounded-[40px] p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col justify-between overflow-hidden"
            id="plate-hole-daily-soup"
          >
            {/* 배경 기하학적 데코 */}
            <div className="absolute right-0 bottom-0 opacity-[0.03] text-[180px] pointer-events-none select-none">
              🍱
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-100 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-6 bg-blue-600 rounded-full"></div>
                <span className="text-sm md:text-base font-black text-slate-950 tracking-tight">TODAY'S LUNCH</span>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-100 shadow-sm ml-1.5">
                  식단 슬라이더
                </span>
              </div>

              {/* 슬라이더 컨트롤러 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMenu}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 transition-all cursor-pointer border border-slate-200 shadow-xs"
                  title="이전 식단"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xxs font-extrabold text-slate-500 font-mono bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                  {activeMenuIdx + 1} / {schoolLunchMenus.length}
                </span>
                <button
                  onClick={handleNextMenu}
                  className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white active:scale-95 transition-all cursor-pointer shadow-sm"
                  title="다음 식단"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* 식단 리스트 콘텐츠 */}
            <div className="my-auto py-5 text-left font-sans">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-base md:text-lg text-blue-600 font-extrabold">{activeMenu.date}</span>
                  <span className="text-xs text-slate-400 font-bold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md font-mono">{activeMenu.kcal} kcal</span>
                </div>
                <span className="text-xxs text-slate-400 font-bold">💡 오른쪽 위의 화살표를 눌러 다른 날의 맛있는 특식을 확인해 보세요!</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 주식 (밥 & 국) */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[80px]">
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-extrabold w-fit mb-2">주식 (밥 & 국)</span>
                  <span className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed">{activeMenu.rice} / {activeMenu.soup}</span>
                </div>

                {/* 반찬들 */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[80px]">
                  <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-extrabold w-fit mb-2">오늘의 반찬</span>
                  <div className="flex flex-col gap-1">
                    {activeMenu.dishes.map((dish, idx) => (
                      <span key={idx} className="text-xs font-semibold text-slate-700 truncate">• {dish}</span>
                    ))}
                  </div>
                </div>

                {/* 후식 (디저트) */}
                <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100/50 flex flex-col justify-between min-h-[80px]">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-extrabold w-fit mb-2">달콤 후식</span>
                  <span className="text-xs md:text-sm font-black text-emerald-600 leading-relaxed">{activeMenu.dessert}</span>
                </div>
              </div>
            </div>

            {/* 영양 성분 & 칼로리 표시 */}
            <div className="bg-slate-50 rounded-2xl px-4 py-2.5 flex justify-between items-center text-[10px] font-semibold text-slate-500 border border-slate-100 flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <Info size={12} className="text-slate-400" />
                <span>알레르기 정보: 항목별 괄호 안 번호 참조 (대두, 밀, 우유 등 포함)</span>
              </span>
              <span className="text-blue-600 font-extrabold flex items-center gap-1">
                <span>지구를 살리는 잔반 제로 실천 🌱</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 기하학적 탭 네비게이션 데코레이션 */}
      <footer className="mt-8 flex justify-center gap-10 text-slate-400 font-bold text-xs uppercase tracking-widest border-b border-slate-200 pb-4 max-w-sm mx-auto">
        <div className="text-blue-600 border-b-2 border-blue-600 pb-1 cursor-pointer">Home</div>
        <div className="hover:text-slate-600 cursor-pointer transition-colors">Calendar</div>
        <div className="hover:text-slate-600 cursor-pointer transition-colors">Nutrition</div>
        <div className="hover:text-slate-600 cursor-pointer transition-colors">Profile</div>
      </footer>

      {/* 하단 저작권 및 격려 문구 */}
      <div className="mt-6 text-center text-xs text-slate-400">
        <p>© 2026 MEAL MATE. Designed with Geometric Balance.</p>
        <p className="mt-1 font-semibold text-blue-500/80">"맛있는 한 끼, 소중한 한 표! 오늘도 든든하고 영양 가득한 하루 되세요!"</p>
      </div>
    </div>
  );
}
