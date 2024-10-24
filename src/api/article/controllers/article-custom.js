'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

const populateAttribute = ({ components, attributes }) => {
  return Object.keys(attributes).reduce((currentPopulate, attributeName) => {
    const attribute = attributes[attributeName];
    if (attribute.type === 'component') {
      const componentPopulate = populateAttribute({
        components,
        attributes: components[attribute.component].attributes
      });
      return {
        ...currentPopulate,
        [attributeName]: { populate: componentPopulate },
      };
    }
    if (attribute.type === 'media') {
      return {
        ...currentPopulate,
        [attributeName]: true,
      };
    }
    if (attribute.type === 'relation') {
      return {
        ...currentPopulate,
        [attributeName]: true,
      };
    }
    return currentPopulate;
  }, {});
};

module.exports = createCoreController('api::article.article', ({ strapi }) => ({

  async findBySlug(ctx) {
    const { slug } = ctx.params;

    const contentType = strapi.contentType('api::article.article');
    const populate = populateAttribute({
        components: strapi.components,
        attributes: contentType.attributes
    });

    // Use findMany without filters first
    const entities = await strapi.entityService.findMany('api::article.article', {
        populate,
        filters: { slug },
    });

    if (!entities || entities.length === 0) {
        return ctx.notFound('Article not found');
    }

    const entity = entities[0];

    // Sanitize the output manually
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    // Return the response
    return this.transformResponse(sanitizedEntity);
    },

  async updateBySlug(ctx) {
    const { slug } = ctx.params;
    const { data } = ctx.request.body;

    const [article] = await strapi.entityService.findMany('api::article.article', {
      filters: { slug },
    });

    if (!article) {
      return ctx.notFound('Article not found');
    }

    const updatedArticle = await strapi.entityService.update('api::article.article', article.id, {
      data,
    });

    const sanitizedEntity = await this.sanitizeOutput(updatedArticle, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  async deleteBySlug(ctx) {
    const { slug } = ctx.params;

    const [article] = await strapi.entityService.findMany('api::article.article', {
      filters: { slug },
    });

    if (!article) {
      return ctx.notFound('Article not found');
    }

    const deletedArticle = await strapi.entityService.delete('api::article.article', article.id);

    const sanitizedEntity = await this.sanitizeOutput(deletedArticle, ctx);
    return this.transformResponse(sanitizedEntity);
  },
}));