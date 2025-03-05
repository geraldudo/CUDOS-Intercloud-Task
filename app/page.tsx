"use client"
import Image from "next/image";
import { useState } from "react";
import { getGeminiPrediction } from "./utils/gemini";

export default function Home() {
  const [symptoms, setSymptoms] = useState("");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    setPrediction(null); // Clear previous prediction

    try {
      const simulatedResponse = await simulateAIPrediction(symptoms);
      setPrediction(simulatedResponse);
    } catch (error) {
      console.error("Error predicting illness:", error);
      setPrediction("An error occurred during prediction.");
    } finally {
      setLoading(false);
    }
  };

  const simulateAIPrediction = async (symptoms: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
    const res = await getGeminiPrediction(symptoms)
    return res
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800 shadow p-6">
        <h1 className="text-2xl font-semibold text-center">AI Illness Predictor</h1>
      </header>
      <main className="container mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Enter Your Symptoms</h2>
          <textarea
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={4}
            placeholder="e.g., Fever, cough, headache..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          ></textarea>
          <button
            className={`mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? "Predicting..." : "Predict Illness"}
          </button>
        </div>

        {prediction && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Prediction</h2>
            <p className="text-gray-700 dark:text-gray-300">{prediction}</p>
          </div>
        )}
      </main>
      <footer className="text-center p-4 text-sm text-gray-500 dark:text-gray-400">
        Disclaimer: This is for informational purposes only and should not be used as a substitute for professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment.
      </footer>
    </div>
  );
}