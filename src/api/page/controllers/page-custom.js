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

module.exports = createCoreController('api::page.page', ({ strapi }) => ({

  async findBySlug(ctx) {
    const { slug } = ctx.params;

    const contentType = strapi.contentType('api::page.page');
    const populate = populateAttribute({
        components: strapi.components,
        attributes: contentType.attributes
    });

    // Use findMany without filters first
    const entities = await strapi.entityService.findMany('api::page.page', {
        populate,
        filters: { slug },
    });

    if (!entities || entities.length === 0) {
        return ctx.notFound('page not found');
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

    const [page] = await strapi.entityService.findMany('api::page.page', {
      filters: { slug },
    });

    if (!page) {
      return ctx.notFound('page not found');
    }

    const updatedPage = await strapi.entityService.update('api::page.page', page.id, {
      data,
    });

    const sanitizedEntity = await this.sanitizeOutput(updatedPage, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  async deleteBySlug(ctx) {
    const { slug } = ctx.params;

    const [page] = await strapi.entityService.findMany('api::page.page', {
      filters: { slug },
    });

    if (!page) {
      return ctx.notFound('page not found');
    }

    const deletedPage = await strapi.entityService.delete('api::page.page', page.id);

    const sanitizedEntity = await this.sanitizeOutput(deletedPage, ctx);
    return this.transformResponse(sanitizedEntity);
  },
}));