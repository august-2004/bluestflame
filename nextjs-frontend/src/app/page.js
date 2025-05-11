"use client";
import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // ✅ required
import ProgressCircle from "@/app/comps/Progressbar";
import GaugeComponent from "react-gauge-component";
import SkillList from "./comps/SkillList";

function Page() {
	const [gram, setGram] = useState(0);
	const [resText, setRes] = useState("");
	const [job, setJob] = useState("");
	const [matched, setMatched] = useState([]);
	const [unmatched, setUnmatched] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loading2, setLoading2] = useState(true);
	const [filename, setFilename] = useState("");
	const [sugg, setSugg] = useState("");
	const [jobmatch, setJobmatch] = useState(0);
	const [access, setAccess] = useState(0);
	const [jobs, setJoblinks] = useState([]);
	const [ques, setQues] = useState("");
	const questions = [
		"Explain the difference between HTTP and HTTPS.",
		"What are the key differences between REST and GraphQL?",
		"How does a browser render a webpage?",
		"What is a closure in JavaScript?",
		"Describe the event loop and call stack in JavaScript.",
		"What are Promises and async/await in JavaScript?",
		"Explain how React uses the Virtual DOM.",
		"What is the difference between props and state in React?",
		"What are the four pillars of Object-Oriented Programming?",
		"Describe how TCP ensures reliable data transfer.",
		"What is the difference between SQL and NoSQL databases?",
		"What is normalization in databases and why is it important?",
		"Explain how DNS works.",
		"How does the OS handle a system call?",
		"What are threads, and how do they differ from processes?",
	];

	const fetchQues = async () => {
		try {
			const formData = new FormData();
			formData.append("resume_text", resText);
			formData.append("job_description", job);
			const res = await fetch("http://localhost:8000/questions", {
				method: "POST",

				body: formData,
			});

			if (res.ok) {
				const data = await res.json();
				console.log(data);
				setQues(data);
			} else {
				const errorText = await res.text();
				console.error("Error", res.statusText, errorText); // More insight
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const fetchSugg = async () => {
		setLoading2(true);
		try {
			const formData = new FormData();
			formData.append("resume_text", resText);
			formData.append("job_description", job);
			const res = await fetch("http://localhost:8000/suggestions", {
				method: "POST",

				body: formData,
			});

			if (res.ok) {
				const data = await res.json();
				console.log(data);
				setSugg(data.suggestions);
			} else {
				const errorText = await res.text();
				console.error("Error", res.statusText, errorText); // More insight
			}
		} catch (error) {
			console.error("Error:", error);
			setSugg({ message: "Kindly Refresh the Page Once" });
		} finally {
			setLoading2(false); // Stop loader
		}
	};

	const fetchSkill = async () => {
		setLoading(true); // Start loader
		try {
			const formData = new FormData();
			formData.append("resume_text", resText);
			formData.append("job_description", job);
			const res = await fetch("http://localhost:8000/matched-skills", {
				method: "POST",

				body: formData,
			});

			if (res.ok) {
				const data = await res.json();
				setMatched(data.matched);
				setUnmatched(data.unmatched);
				if (data.matched.length + data.unmatched.length > 0) {
					setJobmatch(
						Math.trunc(
							(data.matched.length /
								(data.matched.length + data.unmatched.length)) *
								100
						)
					);
				}
			} else {
				const errorText = await res.text();
				console.error("Error", res.statusText, errorText); // More insight
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false); // Stop loader
		}
	};

	const fetchAccess = async () => {
		try {
			const formData = new FormData();

			formData.append("filename", localStorage.getItem("uploaded_filename"));

			const res = await fetch("http://localhost:8000/formatting-checker", {
				method: "POST",

				body: formData,
			});
			if (res.ok) {
				const data = await res.json();
				setAccess(data.score);
				console.log(`Access score: ${data.score}`);
				// setSugg({ ...sugg, "Formatting Suggestions": data.deductions });
			}
		} catch (err) {
			console.error(`Error in getting formatting analysis : ${err}`);
		}
	};

	const fetchJobLinks = async () => {
		try {
			const formData = new FormData();
			formData.append("resume_text", resText);
			const res = await fetch("http://localhost:8000/scrape-jobs", {
				method: "POST",

				body: formData,
			});
			if (res.ok) {
				const data = await res.json();
				setJoblinks(data);
			}
		} catch (err) {
			console.error(`Error in getting formatting analysis : ${err}`);
		}
	};

	useEffect(() => {
		setGram(localStorage.getItem("grammar_score"));
		setRes(localStorage.getItem("resume_text"));
		setJob(localStorage.getItem("job_desc"));
		setFilename(localStorage.getItem("highlighted_filename"));
	}, []);

	useEffect(() => {
		if (resText && job) {
			fetchSkill();
			fetchAccess();
			fetchJobLinks();
			fetchSugg();
			fetchQues();
		}
	}, [resText, job]);

	return (
		<div>
			<header className=""></header>
			<div className="flex">
				<div className=" h-[98vh] w-[70vw] flex items-center justify-center ml-4">
					<iframe
						src={`http://localhost:8000/download-file?filename=${filename}#toolbar=0&navpanes=0&scrollbar=0`}
						className="w-[545px] h-[705px] "
						style={{ border: "none" }}
					></iframe>
				</div>
				<div className="flex flex-col">
					<h1 className="text-2xl font-semibold font-mono m-4 mt-8">METRICS</h1>
					{/* First Container */}
					<div className="flex items-center justify-center bg-[#000000] rounded-2xl  h-[23vh] w-[60vw] m-4 mt-[-13px]">
						<ProgressCircle
							percentage={access}
							size={120}
							label="Accessibility"
						/>
						<ProgressCircle percentage={gram} size={120} label="Grammar" />
						<ProgressCircle
							percentage={jobmatch}
							size={120}
							label="Role Match"
						/>
					</div>

					{/* Second Container */}

					<h1 className="text-2xl font-semibold font-mono m-4 mt-3">
						SKILL MATCH
					</h1>
					{loading ? (
						<div className="h-24 flex items-center justify-center">
							<div className="flex justify-center items-center h-24">
								<div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
							</div>
						</div>
					) : (
						<SkillList matched={matched} unmatched={unmatched} />
					)}

					<h1 className="text-2xl font-semibold font-mono m-4 mt-3">
						SUGGESTIONS
					</h1>

					{/* Third Container */}
					<div className="flex  bg-black rounded-2xl  h-[41vh] w-[60vw] m-4 mt-[-13px]   p-3 overflow-y-scroll ">
						{loading2 ? (
							<div className="h-24 flex items-center justify-center w-[200px] mx-auto">
								<div className="flex justify-center items-center h-24">
									<div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
								</div>
							</div>
						) : (
							<div className="text-lg font-mono space-y-4">{sugg}</div>
						)}
					</div>
				</div>
			</div>
			<div className="overflow-x-auto rounded-lg border border-gray-700 m-4">
				<table className="min-w-full divide-y divide-gray-600 text-white font-mono">
					<thead className="bg-gray-800">
						<tr>
							<th className="px-4 py-3 text-left text-sm font-semibold">
								Title
							</th>
							<th className="px-4 py-3 text-left text-sm font-semibold">
								Company
							</th>
							<th className="px-4 py-3 text-left text-sm font-semibold">
								Location
							</th>
							<th className="px-4 py-3 text-left text-sm font-semibold">
								Description
							</th>
							<th className="px-4 py-3 text-left text-sm font-semibold">
								Link
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-700 bg-black">
						{jobs.map((job, index) => (
							<tr key={index} className="hover:bg-gray-800 transition-colors">
								<td className="px-4 py-3 text-sm">{job.title || "N/A"}</td>
								<td className="px-4 py-3 text-sm">{job.company || "N/A"}</td>
								<td className="px-4 py-3 text-sm">{job.location || "N/A"}</td>
								<td className="px-4 py-3 text-sm max-w-sm prose prose-sm prose-invert overflow-hidden">
									{job.description ? (
										<ReactMarkdown>
											{job.description.slice(0, 400) + "..."}
										</ReactMarkdown>
									) : (
										<span>No description provided.</span>
									)}
								</td>
								<td className="px-4 py-3 text-sm text-blue-400 underline">
									<a
										href={job.job_url}
										target="_blank"
										rel="noopener noreferrer"
									>
										View Job
									</a>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className=" w-[95vw] min-h-[60vh] h-max mx-auto p-6 overflow-y-auto rounded-xl shadow-lg text-black">
				<h2 className="text-4xl text-center mb-4 font-mono font-black text-white ">
					Questionnaire
				</h2>
				<div className="space-y-6 p-4">
					<div className="whitespace-pre-line text-white font-mono text-lg">
						{ques}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Page;
