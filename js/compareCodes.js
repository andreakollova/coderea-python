// compareCodes.js

/**
 * Compare two strings (original vs user code) line by line.
 * Returns an HTML string where each user line is colored:
 *   - Green if it matches the corresponding original line
 *   - Red   if it does not match
 *
 * @param {string} original - The original code
 * @param {string} user     - The user-entered code
 * @return {string}         - HTML string with line-by-line color coding
 */
export function highlightDifferences(original, user) {
    const originalLines = original.split('\n');
    const userLines = user.split('\n');
    
    // We'll build an HTML snippet to display each user line in a colored <div> or <span>
    let resultHTML = '';
  
    // Go up to the maximum line count of either original or user
    const maxLines = Math.max(originalLines.length, userLines.length);
  
    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] ?? '';
      const userLine = userLines[i] ?? '';
  
      if (originalLine.trim() === userLine.trim()) {
        // If lines match exactly (ignoring leading/trailing whitespace),
        // wrap user line in a green span or div
        resultHTML += `<div style="color: #00ff7f;">${escapeHtml(userLine)}</div>`;
      } else {
        // If lines differ, wrap user line in a red span or div
        resultHTML += `<div style="color: red;">${escapeHtml(userLine)}</div>`;
      }
    }
  
    return resultHTML;
  }
  
  /**
   * Simple utility to safely escape HTML special characters,
   * so code is displayed literally.
   */
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  