export type AttackAutomationParam = Pick<
    AudioParam,
    "setValueAtTime" | "linearRampToValueAtTime"
>;

export function scheduleAttack(gainParam: AttackAutomationParam, startTime: number) {
    gainParam.setValueAtTime(0, startTime);
    gainParam.linearRampToValueAtTime(0.15, startTime + 0.01);
}
export function scheduleRelease(gainParam: AttackAutomationParam, stopTime: number) {
    gainParam.setValueAtTime(0.15, stopTime);
    gainParam.linearRampToValueAtTime(0, stopTime - 0.03);
}
