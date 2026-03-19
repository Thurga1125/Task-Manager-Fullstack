package com.taskmanager.util;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

/**
 * Utility class for sanitizing user input to prevent XSS attacks.
 * Strips all HTML tags and attributes from strings before persisting.
 */
public final class SanitizationUtil {

    private SanitizationUtil() {}

    /**
     * Strips all HTML tags, leaving only plain text.
     * Returns null if input is null.
     */
    public static String sanitize(String input) {
        if (input == null) return null;
        return Jsoup.clean(input, Safelist.none());
    }

    /**
     * Sanitizes and trims whitespace.
     * Returns null if input is null or blank after sanitization.
     */
    public static String sanitizeAndTrim(String input) {
        if (input == null) return null;
        String cleaned = Jsoup.clean(input.trim(), Safelist.none());
        return cleaned.isBlank() ? null : cleaned;
    }
}
