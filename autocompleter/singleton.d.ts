/**
 * Simple function to create typed  and scope safe singletons inspired by react hooks
 * @param initialValue: The initial value of the singleton
 * @example
 * // declare and use a new singleton
 * const [getValue, setValue] = singleton(0)
 * // increment the singleton value
 * setValue(getValue() + 1)
 * @returns [singletonGetter, singletonSetter]
 */
export default function singleton<T>(initialValue: T): readonly [() => T, (newValue: T) => T];
