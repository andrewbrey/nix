import * as React from 'react';
import { useObservable } from '../hooks/useObservable';
import { lastMixStopped, mostRecentMix, restartActiveMix, stopActiveMix } from '../store';

export const MixControlButton: React.FC<React.HTMLAttributes<HTMLButtonElement>> = ({ className }) => {
	const activeMix = useObservable(mostRecentMix, mostRecentMix.initialValue());
	const activeMixStopped = useObservable(lastMixStopped, lastMixStopped.initialValue());

	const canStop = React.useMemo<boolean>(() => {
		return activeMix.length && !activeMixStopped;
	}, [activeMix, activeMixStopped]);

	const canRestart = React.useMemo<boolean>(() => {
		return activeMix.length && activeMixStopped;
	}, [activeMix, activeMixStopped]);

	return (
		<div className={className}>
			{canStop ? (
				<button
					className="px-3 py-1.5 rounded appearance-none text-sm flex items-center space-x-1 bg-blue-700 text-blue-100 transition-colors duration-150 focus:outline-none focus:bg-blue-500 hover:bg-blue-500"
					onClick={stopActiveMix}
				>
					<span className="whitespace-nowrap font-semibold">Pause Mix</span>
					<svg className="w-4 h-4 mb-0.5" viewBox="0 0 20 20" fill="currentColor">
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			) : null}
			{canRestart ? (
				<button
					className="px-3 py-1.5 rounded appearance-none text-sm flex items-center space-x-1 bg-blue-700 text-blue-100 transition-colors duration-150 focus:outline-none focus:bg-blue-500 hover:bg-blue-500"
					onClick={restartActiveMix}
				>
					<span className="whitespace-nowrap font-semibold">Restart Mix</span>
					<svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
						<path
							fillRule="evenodd"
							d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			) : null}
		</div>
	);
};
