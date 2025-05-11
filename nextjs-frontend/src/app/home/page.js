"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function Page2() {
	const router = useRouter();
	const fileInputRef = useRef(null);
	const [showJDModal, setShowJDModal] = useState(false);
	const [resumeUploaded, setResumeUploaded] = useState(false);
	const [jobDesc, setJobDesc] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const submitResumeHandler = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type === "application/pdf") {
			setResumeUploaded(true);
		} else {
			alert("Please upload a valid PDF file.");
		}
	};

	const handleJDSubmit = async () => {
		if (jobDesc.trim() === "") {
			alert("Please enter a job description.");
			return;
		}
		setLoading(true); // Set loading state

		const formData = new FormData();
		formData.append("resume", fileInputRef.current.files[0]); // Add the resume file
		formData.append("job_description", jobDesc); // Add the job description text

		try {
			// Send the data to your backend (adjust the URL as needed)
			const response = await fetch("http://localhost:8000/upload-resume", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const data = await response.json(); // Assuming your backend sends JSON

				// Store response data in localStorage
				localStorage.setItem("resume_text", data.resume_text);
				localStorage.setItem("job_desc", data.job_description);
				localStorage.setItem("uploaded_filename", data.uploaded_filename);
				localStorage.setItem("highlighted_filename", data.highlighted_filename);
				localStorage.setItem("grammar_score", data.grammar_score);

				// Redirect to the desired route after success
				router.push(`/`);
			} else {
				setError("Failed to upload the resume and job description.");
				console.error("Error submitting the form", response.statusText);
			}
		} catch (error) {
			setError("An error occurred. Please try again later.");
			console.error("Error:", error);
		} finally {
			setLoading(false); // Stop loading state
		}
	};

	return (
		<div className="relative">
			{/* Header */}
			<div className="flex items-center justify-center mt-60">
				<div className="w-12 h-12 bg-blue-800 rounded-full animate-pulse"></div>
				<h1 className="text-6xl ml-2 font-mono font-black">BLUEST~FLAME</h1>
			</div>

			{/* Tagline */}
			<div className="flex items-center justify-center mt-5">
				<h1 className="text-3xl font-mono font-medium text-center px-4">
					Artificial Intelligence based ATS Resume Checker and Analyzer
				</h1>
			</div>

			{/* Buttons */}
			<div className="flex justify-center mt-5 gap-4">
				{/* Resume Upload */}
				<button
					onClick={submitResumeHandler}
					className="border-2 border-white w-[270px] h-[45px] rounded-4xl bg-white font-mono font-black text-2xl text-black hover:bg-black hover:text-white transition duration-200"
				>
					{resumeUploaded ? "Resume Uploaded" : "Upload Resume"}
				</button>

				{/* Job Description Upload */}
				{resumeUploaded && (
					<button
						onClick={() => setShowJDModal(true)}
						className="border-2 border-white w-[270px] h-[45px] rounded-4xl bg-white font-mono font-black text-2xl text-black hover:bg-black hover:text-white transition duration-200"
					>
						Upload JD
					</button>
				)}

				{/* Hidden Resume Input */}
				<input
					type="file"
					accept="application/pdf"
					ref={fileInputRef}
					onChange={handleFileChange}
					className="hidden"
				/>
			</div>

			{/* JD Modal */}
			<AnimatePresence>
				{showJDModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
					>
						<motion.div
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0.8 }}
							className="bg-black text-white rounded-xl p-6 w-[90vw] max-w-xl shadow-lg"
						>
							<h2 className="text-xl font-bold mb-4 font-mono">
								Paste your Job Description
							</h2>
							<textarea
								className="w-full h-40 border border-white rounded-md p-2 bg-black text-white font-mono"
								value={jobDesc}
								autoFocus
								onChange={(e) => setJobDesc(e.target.value)}
							></textarea>
							<div className="flex justify-end mt-4 gap-2">
								<button
									onClick={() => setShowJDModal(false)}
									className="px-4 py-2 font-bold text-red-400"
								>
									Cancel
								</button>
								<button
									onClick={handleJDSubmit}
									className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-900"
									disabled={loading}
								>
									{loading ? "Uploading..." : "Upload"}
								</button>
							</div>
							{error && <p className="text-red-400 mt-4">{error}</p>}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Footer */}
			<div className="bg-blue-800 w-full h-[12vh] mt-[300px] flex items-center justify-center font-mono">
				<h1 className="text-white text-2xl">
					Made with ♥️ by the{" "}
					<i>
						<b>BLUEST FLAME</b>
					</i>{" "}
					Team
				</h1>
			</div>
		</div>
	);
}

export default Page2;
