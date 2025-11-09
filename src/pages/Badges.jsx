import GamificationBadges from '../components/GamificationBadges';

const Badges = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Badges & Achievements</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your progress and earn badges for consistent medication adherence
        </p>
      </div>
      <GamificationBadges />
    </div>
  );
};

export default Badges;
