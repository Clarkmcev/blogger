import {
  createImageUrlBuilder,
  createCurrentUserHook,
  createClient,
} from "next-sanity";

// import createImageUrlBuilder from "@sanity/image-url";
import imageUrlBuilder from "@sanity/image-url";

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: "2021-10-21", // Learn more: https://www.sanity.io/docs/api-versioning
  useCdn: process.env.NODE_ENV === "production",
};

export const sanityClient = createClient(config);

const builder = imageUrlBuilder(config);

export function urlFor(source) {
  return builder.image(source);
}

// export const urlFor = (source) => createImageUrlBuilder(config).image(source);
