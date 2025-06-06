export type TagState = 'include' | 'exclude' | null;

export const cycleTagState = (current: TagState): TagState =>
    current === 'include' ? 'exclude' : current === 'exclude' ? null : 'include';