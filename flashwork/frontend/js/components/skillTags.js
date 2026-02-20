// Skill Tags Component
export function createSkillTags(skills) {
    const container = document.createElement('div');
    container.className = 'skill-tags';
    
    skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        container.appendChild(tag);
    });
    
    return container;
}
