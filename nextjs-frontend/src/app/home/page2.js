"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Page() {
	const [textInput, setTextInput] = useState("");
	const router = useRouter();
	const [file, setFile] = useState(null);
	const [response, setResponse] = useState(null);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleTextChange = (e) => {
		setTextInput(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("resume", file);
		formData.append("job_description", textInput);

		try {
			const res = await fetch("http://localhost:8000/upload-resume", {
				method: "POST",
				body: formData,
			});

			if (res.ok) {
				const data = await res.json(); // Assuming your backend sends JSON
				setResponse(data); // Set the response data
				localStorage.setItem("resume_text", data.resume_text);
				localStorage.setItem("job_desc", data.job_description);
				localStorage.setItem("uploaded_filename", data.uploaded_filename);
				localStorage.setItem("highlighted_filename", data.highlighted_filename);
				localStorage.setItem("grammar_score", data.grammar_score);
				router.push(`/`);
			} else {
				console.error("Error submitting the form", res.statusText);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					type="file"
					accept="application/pdf"
					onChange={handleFileChange}
				/>
				<input type="text" value={textInput} onChange={handleTextChange} />
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}

export default Page;
