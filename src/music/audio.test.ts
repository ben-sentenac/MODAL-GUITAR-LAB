import { describe, it, expect, vi } from "vitest";
import { scheduleAttack,scheduleRelease, type AttackAutomationParam } from "./audio";


describe("scheduleAttack", () => {

    it('should call setValueAtTime', () => {

        const MockAudiParam: AttackAutomationParam = {
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
        }
        scheduleAttack(MockAudiParam, 0);
        expect(MockAudiParam.setValueAtTime).toHaveBeenCalledTimes(1);
        expect(MockAudiParam.setValueAtTime).toHaveBeenCalledWith(0,0);
        expect(MockAudiParam.linearRampToValueAtTime).toHaveBeenCalledWith(0.15,0 + 0.01);
    })
});

describe("scheduleRelease", () => {

    it('should call setValueAtTime', () => {

        const MockAudiParam: AttackAutomationParam = {
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
        }
        scheduleRelease(MockAudiParam, 1);
        expect(MockAudiParam.setValueAtTime).toHaveBeenCalledTimes(1);
        expect(MockAudiParam.setValueAtTime).toHaveBeenCalledWith(0.15,1);
        expect(MockAudiParam.linearRampToValueAtTime).toHaveBeenCalledWith(0,1 - 0.03);
    })
});
