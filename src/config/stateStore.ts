
const stateStore = new Map<string, { timestamp: number }>();


export const storeState = (state: string) => {
  stateStore.set(state, { timestamp: Date.now() });
};


export const verifyAndRemoveState = (state: string): boolean => {
  const stateData = stateStore.get(state);
  if (!stateData) return false;

  
  stateStore.delete(state);

  
  const isExpired = Date.now() - stateData.timestamp > 5 * 60 * 1000;
  if (isExpired) return false;

  return true;
}; 