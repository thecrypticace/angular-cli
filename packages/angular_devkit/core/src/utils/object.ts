/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/** @deprecated Since v12.0, unused by the Angular tooling */
export function mapObject<T, V>(
  obj: { [k: string]: T },
  mapper: (k: string, v: T) => V,
): { [k: string]: V } {
  return Object.keys(obj).reduce((acc: { [k: string]: V }, k: string) => {
    acc[k] = mapper(k, obj[k]);

    return acc;
  }, {});
}

const copySymbol = Symbol();

export function deepCopy<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((o) => deepCopy(o)) as unknown as T;
  } else if (value && typeof value === 'object') {
    const valueCasted = value as {
      [copySymbol]?: T;
      toJSON?: () => string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };

    if (valueCasted[copySymbol]) {
      // This is a circular dependency. Just return the cloned value.
      return valueCasted[copySymbol] as T;
    }

    if (valueCasted['toJSON']) {
      return JSON.parse(valueCasted['toJSON']());
    }

    const copy = Object.create(Object.getPrototypeOf(valueCasted));
    valueCasted[copySymbol] = copy;
    for (const key of Object.getOwnPropertyNames(valueCasted)) {
      copy[key] = deepCopy(valueCasted[key]);
    }
    valueCasted[copySymbol] = undefined;

    return copy;
  } else {
    return value;
  }
}
