// Mock API utility - wraps data access with simulated network delay
export function mockApi<T>(data: T, delayMs?: number): Promise<T> {
  const delay = delayMs ?? (300 + Math.random() * 300);
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

export function mockApiWithError<T>(data: T, errorRate = 0): Promise<T> {
  const delay = 300 + Math.random() * 300;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject(new Error('Network error'));
      } else {
        resolve(data);
      }
    }, delay);
  });
}
