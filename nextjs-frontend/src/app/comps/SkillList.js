import React from "react";

export default function SkillList({ matched = [], unmatched = [] }) {
	if (matched.length === 0 && unmatched.length === 0) return <></>;

	return (
		<div className="p-4 space-y-4  flex items-center mt-[-27px]">
			<div></div>
			<div>
				<div className="flex flex-wrap gap-2">
					{matched.map((skillName, idx) => (
						<Skill
							key={`matched-${idx}`}
							name={skillName}
							type="matched"
						/>
					))}

					{unmatched.map((skillName, idx) => (
						<Skill
							key={`unmatched-${idx}`}
							name={skillName}
							type="unmatched"
						/>
					))}
				</div>
			</div>
		</div>
	);
}

function Skill({ type, name }) {
	const color =
		type === "matched"
			? "bg-green-950 text-green-200"
			: "bg-red-950 text-red-200";

	return (
		<span className={`px-3 py-1 rounded-full text-md font-medium ${color}`}>
			{name}
		</span>
	);
}
