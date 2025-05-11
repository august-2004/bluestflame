"use client";
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProgressCircle = ({ percentage = 0, size = 120, label = "" }) => {
	return (
		<div className="flex flex-col items-center m-12">
			<div className="rounded-full" style={{ width: size, height: size }}>
				<CircularProgressbar
					value={percentage}
					text={`${percentage}%`}
					styles={buildStyles({
						pathColor: "#193cb8",
					})}
				/>
			</div>
			<p className="mt-2 text-mds font-mono font-medium text-white text-center">
				{label}
			</p>
		</div>
	);
};

export default ProgressCircle;
