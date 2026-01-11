
import React, { useState, useMemo } from 'react';
import { ReviewItem } from '../types';
import { CheckCircle2, Circle, Trash2, Plus, BookOpen, Filter } from 'lucide-react';

interface ReviewViewProps {
  reviews: ReviewItem[];
  subjects: string[];
  topics: Record<string, string[]>;
  subjectColors: Record<string, string>;
  onAddReview: (review: Omit<ReviewItem, 'id' | 'date'>) => void;
  onToggleReview: (id: number) => void;
  onDeleteReview: (id: number) => void;
  theme?: 'dark' | 'light';
  t: any;
}

const ReviewView: React.FC<ReviewViewProps> = ({
  reviews,
  subjects,
  topics,
  subjectColors,
  onAddReview,
  onToggleReview,
  onDeleteReview,
  theme = 'dark',
  t
}) => {
  const isLight = theme === 'light';
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showCompleted, setShowCompleted] = useState(false);

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      if (review.completed !== showCompleted) return false;
      if (filterSubject !== 'all' && review.subject !== filterSubject) return false;
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reviews, filterSubject, showCompleted]);

  const handleAddReview = () => {
    if (!selectedSubject) return;
    
    onAddReview({
      subject: selectedSubject,
      topic: selectedTopic || undefined,
      notes: notes || undefined,
      completed: false
    });

    setSelectedSubject('');
    setSelectedTopic('');
    setNotes('');
    setShowAddForm(false);
  };

  const getSubjectColor = (subject: string) => {
    return subjectColors[subject] || '#6366f1';
  };

  return (
    <div className="relative min-h-full w-full max-w-5xl mx-auto py-12 px-4 animate-fade-in">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
              <BookOpen size={24} />
            </div>
            <h1 className={`text-4xl font-extrabold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              {t.reviewTitle}
            </h1>
          </div>
          <p className={`text-sm ${isLight ? 'text-zinc-500' : 'text-zinc-400'} ml-[60px]`}>
            {t.reviewSubtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
            isLight 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-indigo-600 text-white hover:bg-indigo-500'
          }`}
        >
          <Plus size={20} />
          {t.addReview}
        </button>
      </div>

      {showAddForm && (
        <div className={`p-6 rounded-2xl mb-6 border ${
          isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            {t.addReview}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                {t.subjects_manage}
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedTopic('');
                }}
                className={`w-full px-4 py-3 rounded-xl border font-medium ${
                  isLight 
                    ? 'bg-zinc-50 border-zinc-200 text-zinc-900' 
                    : 'bg-zinc-800 border-zinc-700 text-white'
                }`}
              >
                <option value="">{t.chooseTopic}</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {selectedSubject && topics[selectedSubject]?.length > 0 && (
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  {t.topicsLabel}
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border font-medium ${
                    isLight 
                      ? 'bg-zinc-50 border-zinc-200 text-zinc-900' 
                      : 'bg-zinc-800 border-zinc-700 text-white'
                  }`}
                >
                  <option value="">{t.noTopicLabel}</option>
                  {topics[selectedSubject].map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                {t.reviewNotes}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border font-medium resize-none ${
                  isLight 
                    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400' 
                    : 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500'
                }`}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddReview}
                disabled={!selectedSubject}
                className={`px-6 py-3 rounded-xl font-bold flex-1 transition-all ${
                  selectedSubject
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                }`}
              >
                {t.save}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedSubject('');
                  setSelectedTopic('');
                  setNotes('');
                }}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  isLight 
                    ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300' 
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex gap-4 flex-wrap">
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
          isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'
        }`}>
          <Filter size={16} className={isLight ? 'text-zinc-500' : 'text-zinc-400'} />
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className={`bg-transparent font-semibold text-sm ${
              isLight ? 'text-zinc-900' : 'text-white'
            }`}
          >
            <option value="all">{t.allSubjects}</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCompleted(false)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              !showCompleted
                ? 'bg-indigo-600 text-white'
                : isLight
                  ? 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {t.pendingReviews}
          </button>
          <button
            onClick={() => setShowCompleted(true)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              showCompleted
                ? 'bg-indigo-600 text-white'
                : isLight
                  ? 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {t.completedReviews}
          </button>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${
          isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'
        }`}>
          <p className={`text-lg font-semibold mb-2 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {showCompleted ? t.noCompletedReviews : t.noReviews}
          </p>
          {!showCompleted && (
            <p className={`text-sm ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {t.addFirstReview}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map(review => {
            const color = getSubjectColor(review.subject);
            const reviewDate = new Date(review.date).toLocaleDateString(t.locale, {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={review.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isLight 
                    ? 'bg-white border-zinc-200 hover:shadow-lg' 
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => onToggleReview(review.id)}
                    className="mt-1 transition-colors"
                  >
                    {review.completed ? (
                      <CheckCircle2 size={24} className="text-green-500" />
                    ) : (
                      <Circle size={24} className={isLight ? 'text-zinc-300' : 'text-zinc-600'} />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="px-3 py-1 rounded-lg font-bold text-sm text-white"
                        style={{ backgroundColor: color }}
                      >
                        {review.subject}
                      </div>
                      {review.topic && (
                        <div className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                          isLight ? 'bg-zinc-100 text-zinc-600' : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {review.topic}
                        </div>
                      )}
                      <span className={`text-xs ml-auto ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {reviewDate}
                      </span>
                    </div>

                    {review.notes && (
                      <p className={`text-sm mb-2 ${
                        review.completed 
                          ? isLight ? 'text-zinc-400 line-through' : 'text-zinc-500 line-through'
                          : isLight ? 'text-zinc-600' : 'text-zinc-300'
                      }`}>
                        {review.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(t.deleteReview + '?')) {
                        onDeleteReview(review.id);
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isLight 
                        ? 'text-zinc-400 hover:text-red-600 hover:bg-red-50' 
                        : 'text-zinc-500 hover:text-red-400 hover:bg-red-950/30'
                    }`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewView;
