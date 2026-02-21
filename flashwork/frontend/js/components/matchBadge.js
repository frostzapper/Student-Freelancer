// Match Badge Component
export function createMatchBadge(matchPercent) {
    const badge = document.createElement('span');
    badge.className = 'match-badge';
    badge.textContent = `${matchPercent}% Match`;
    return badge;
}
