import { useState, useEffect } from 'react';
import { Observable } from 'rxjs';

type ObservableValueType<T> = T extends Observable<infer X> ? X : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useObservable<U extends Observable<any>>($: U, placeholderValue?: any) {
	type T = ObservableValueType<U>;
	const [value, setValue] = useState<T>(placeholderValue as T);

	useEffect(() => {
		const subscription = $.subscribe(setValue);
		return () => subscription.unsubscribe();
	}, [$]);

	return value;
}
