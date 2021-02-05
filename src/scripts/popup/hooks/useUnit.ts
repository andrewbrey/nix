import { useState, useEffect } from 'react';
import { UnitBase } from '@activejs/core';

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
const bind = <T extends Function>(method: T, thisArg: any): T => method.bind(thisArg);

type UnitValueType<T> = T extends UnitBase<infer X> ? X : never;

/**
 *
 * @param unit
 * @see https://docs.activejs.dev/integrations/react/useunit-hook
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useUnit<U extends UnitBase<any>>(unit: U, placeholderValue?: any) {
	type T = UnitValueType<U>;
	const [value, setValue] = useState<T>(placeholderValue as T);

	useEffect(() => {
		const subscription = unit.subscribe(setValue);
		return () => subscription.unsubscribe();
	}, []);

	return {
		value,
		dispatch: bind(unit.dispatch, unit),
		resetValue: bind(unit.resetValue, unit),
	};
}
