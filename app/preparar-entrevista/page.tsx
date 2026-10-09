import type { Metadata } from "next";
import InterviewPractice from "./InterviewPractice";

export const metadata: Metadata = {
  title: "Preparar entrevista de trabajo | Tu Match Profesional",
  description: "Practicá entrevistas con preguntas orientativas por puesto, competencias, evidencia y método STAR.",
};

export default function PrepareInterviewPage() {
  return <InterviewPractice />;
}
