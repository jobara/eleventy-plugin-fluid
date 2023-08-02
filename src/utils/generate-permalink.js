"use strict";

const { EleventyI18nPlugin } = require("@11ty/eleventy");
const i18n = require("eleventy-plugin-i18n-gettext");
const TemplateConfig = require("@11ty/eleventy/src/TemplateConfig.js");

/**
 * @param  {Object} data - The data object for the current collection item.
 * @param  {String} collectionType - The collection type.
 * @param  {String} collectionSlug - A localized, URL-safe slug for the collection type, used in the generated permalink.
 *
 * @return {String} - The generated permalink.
 */
const generatePermalink = (data, collectionType, collectionSlug) => {
    /* If this post is a "stub" with no localized title, we assume it does not exist and prevent it from building. */
    if (!data.hasOwnProperty("title")) {
        return false;
    }

    const eleventyConfig = new TemplateConfig();
    const lang = EleventyI18nPlugin.LangUtils.getLanguageCodeFromInputPath(data.page.inputPath);
    const locale = lang;
    const langSlug = data.supportedLanguages[lang].slug || lang;
    collectionSlug = collectionSlug || collectionType;
    const slugify = eleventyConfig.userConfig.getFilter("slugify");

    if (collectionType === "pages") {
        /* If the page is a 404 page, return 404.html, optionally prepended with the language code. */
        if (data.page.fileSlug === "404") {
            return (lang === data.defaultLanguage) ? "/404.html" : `/${langSlug}/404.html`;
        }

        /** If the page is the index page, the base path, optionally prepended with the language code. */
        if (data.page.fileSlug === lang) {
            return (lang === data.defaultLanguage) ? "/" : `/${langSlug}/`;
        }

        /* If the page is not the index page, return the page title in a URL-safe format, optionally prepended with the language code. */
        const slug = slugify(data.title);
        if (data.hasOwnProperty("pagination") && data.pagination.pageNumber > 0) {
            return (lang === data.defaultLanguage) ? `/${slug}/${i18n._(locale, "page")}/${data.pagination.pageNumber + 1}/` : `/${langSlug}/${slug}/${i18n._(locale, "page")}/${data.pagination.pageNumber + 1}/`;
        }
        return (lang === data.defaultLanguage) ? `/${slug}/` : `/${langSlug}/${slug}/`;
    } else {
        const slug = slugify(data.title);
        return (lang === data.defaultLanguage) ? `/${collectionSlug}/${slug}/` : `/${langSlug}/${collectionSlug}/${slug}/`;
    }
};

module.exports = generatePermalink;