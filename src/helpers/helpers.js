export const sanitizeForURL = (value) => {
    // Replace spaces with dashes
    const sanitizedTitle = value.replace(/\s+/g, '-');

    // Remove special characters except for dashes, underscores, and periods
    const sanitizedURL = sanitizedTitle.replace(/[^\w-.]/g, '');

    // Convert to lowercase (optional, but often used in URLs)
    const lowercaseURL = sanitizedURL.toLowerCase();

    return lowercaseURL;
};
