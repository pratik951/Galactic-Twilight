import React, { useState } from 'react';

const QUESTIONS = [
	{
		q: 'Which NASA rover landed on Mars in 2012?',
		options: ['Spirit', 'Opportunity', 'Curiosity', 'Perseverance'],
		answer: 2,
	},
	{
		q: 'What does APOD stand for?',
		options: [
			'Asteroid Picture of the Day',
			'Astronomy Picture of the Day',
			'Astronaut Photo of the Day',
			'Astrophysics Photo of the Day',
		],
		answer: 1,
	},
	{
		q: "What is the name of NASA's Near Earth Object tracking service?",
		options: ['NEO Watch', 'Asteroid Alert', 'NeoWs', 'SpaceGuard'],
		answer: 2,
	},
	{
		q: 'Which instrument takes daily images of the sunlit side of Earth?',
		options: ['Hubble', 'EPIC', 'MRO', 'JWST'],
		answer: 1,
	},
];

export default function SpaceQuiz({ open, onClose }) {
	const [step, setStep] = useState(0);
	const [score, setScore] = useState(0);
	const [selected, setSelected] = useState(null);
	const [showResult, setShowResult] = useState(false);

	const current = QUESTIONS[step];

	const handleAnswer = (idx) => {
		setSelected(idx);
		if (idx === current.answer) setScore((s) => s + 1);
		setTimeout(() => {
			setSelected(null);
			if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
			else setShowResult(true);
		}, 900);
	};

	if (!open) return null;
	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 2000,
				background: 'rgba(0,0,0,0.6)',
			}}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			tabIndex={-1}
		>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 60,
					margin: '0 auto',
					background: '#23243a',
					color: '#fff',
					borderRadius: 16,
					boxShadow: '0 2px 16px #000a',
					padding: 24,
					width: 400,
					maxWidth: '90vw',
					maxHeight: '80vh',
					overflowY: 'auto',
				}}
			>
				<button
					onClick={onClose}
					aria-label="Close"
					style={{
						position: 'absolute',
						top: 8,
						right: 12,
						background: 'none',
						color: '#ffd700',
						border: 'none',
						fontSize: 22,
						cursor: 'pointer',
					}}
				>
					×
				</button>
				<h3 style={{ color: '#ffd700', marginTop: 0 }}>
					🧑‍🚀 NASA Space Quiz
				</h3>
				{showResult ? (
					<div style={{ textAlign: 'center', marginTop: 32 }}>
						<div
							style={{
								fontSize: 22,
								color: '#ffd700',
							}}
						>
							Your Score: {score} / {QUESTIONS.length}
						</div>
						<div style={{ marginTop: 16 }}>
							{score === QUESTIONS.length
								? '🌟 Perfect! You are a NASA expert!'
								: score >= 2
								? '🚀 Great job!'
								: 'Keep exploring!'}
						</div>
						<button
							onClick={() => {
								setStep(0);
								setScore(0);
								setShowResult(false);
							}}
							style={{
								marginTop: 24,
								background: '#ffd700',
								color: '#23243a',
								border: 'none',
								borderRadius: 6,
								padding: '6px 16px',
								fontWeight: 600,
							}}
						>
							Try Again
						</button>
					</div>
				) : (
					<>
						<div
							style={{
								fontSize: 18,
								marginBottom: 16,
							}}
						>
							{current.q}
						</div>
						{current.options.map((opt, idx) => (
							<button
								key={opt}
								onClick={() => handleAnswer(idx)}
								disabled={selected !== null}
								style={{
									display: 'block',
									width: '100%',
									textAlign: 'left',
									margin: '8px 0',
									padding: '8px 12px',
									borderRadius: 6,
									background:
										selected === idx
											? idx === current.answer
												? '#4caf50'
												: 'salmon'
											: '#333',
									color: '#fff',
									border: 'none',
									fontWeight: 500,
									fontSize: 15,
									cursor:
										selected === null
											? 'pointer'
											: 'default',
									transition: 'background 0.3s',
								}}
							>
								{opt}
							</button>
						))}
					</>
				)}
			</div>
		</div>
	);
}
