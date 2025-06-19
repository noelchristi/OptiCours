import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

interface Analysis {
  id: string;
  courseId: string;
  courseTitle: string;
  date: string;
  insights: string[];
  recommendations: {
    type: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export default function Analytics() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await api.get('/analytics');
      setAnalyses(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des analyses:', error);
      toast.error('Erreur lors du chargement des analyses');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Analyses</h1>
          <button
            onClick={() => {
              // TODO: Implémenter l'analyse manuelle
              toast.success('Analyse lancée');
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Lancer une analyse
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedAnalysis(analysis)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {analysis.courseTitle}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Analysé le {new Date(analysis.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {analysis.insights.length} insights
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Principaux insights
                  </h3>
                  <ul className="space-y-2">
                    {analysis.insights.slice(0, 3).map((insight, index) => (
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

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Recommandations
                  </h3>
                  <ul className="space-y-2">
                    {analysis.recommendations
                      .slice(0, 2)
                      .map((recommendation, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-3"
                        >
                          <span
                            className={`flex-shrink-0 h-5 w-5 ${getPriorityColor(
                              recommendation.priority
                            )}`}
                          >
                            •
                          </span>
                          <span className="text-gray-600">
                            {recommendation.description}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedAnalysis && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Analyse détaillée - {selectedAnalysis.courseTitle}
                </h2>
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Fermer</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Insights
                  </h3>
                  <ul className="space-y-3">
                    {selectedAnalysis.insights.map((insight, index) => (
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

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Recommandations
                  </h3>
                  <ul className="space-y-3">
                    {selectedAnalysis.recommendations.map(
                      (recommendation, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-3"
                        >
                          <span
                            className={`flex-shrink-0 h-5 w-5 ${getPriorityColor(
                              recommendation.priority
                            )}`}
                          >
                            •
                          </span>
                          <div>
                            <span className="text-gray-900 font-medium">
                              {recommendation.type}
                            </span>
                            <p className="text-gray-600">
                              {recommendation.description}
                            </p>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedAnalysis(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implémenter l'export des analyses
                      toast.success('Analyse exportée');
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Exporter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 