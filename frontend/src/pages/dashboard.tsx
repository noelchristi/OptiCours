import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Layout from '../components/Layout';

interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Analytics {
  totalCourses: number;
  totalResources: number;
  lastAnalysis: {
    date: string;
    insights: string[];
  } | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, analyticsResponse] = await Promise.all([
          api.get('/courses'),
          api.get('/analytics/summary')
        ]);

        setCourses(coursesResponse.data);
        setAnalytics(analyticsResponse.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bienvenue, {user?.email}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-primary-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-primary-900">
                Total des cours
              </h3>
              <p className="text-3xl font-bold text-primary-600">
                {analytics?.totalCourses || 0}
              </p>
            </div>
            <div className="bg-primary-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-primary-900">
                Total des ressources
              </h3>
              <p className="text-3xl font-bold text-primary-600">
                {analytics?.totalResources || 0}
              </p>
            </div>
            <div className="bg-primary-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-primary-900">
                Dernière analyse
              </h3>
              <p className="text-sm text-primary-600">
                {analytics?.lastAnalysis
                  ? new Date(analytics.lastAnalysis.date).toLocaleDateString()
                  : 'Aucune analyse'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Cours récents
          </h2>
          {courses.length === 0 ? (
            <p className="text-gray-500">Aucun cours pour le moment</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => (
                <div
                  key={course.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {course.description}
                  </p>
                  <div className="text-xs text-gray-400">
                    Mis à jour le{' '}
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {analytics?.lastAnalysis && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Derniers insights
            </h2>
            <ul className="space-y-3">
              {analytics.lastAnalysis.insights.map((insight, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 text-gray-600"
                >
                  <span className="flex-shrink-0 h-5 w-5 text-primary-600">
                    •
                  </span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
} 