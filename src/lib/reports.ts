import { graphql } from "@/gql";

/** The reports this person may run. */
export const ReportCatalogDocument = graphql(`
  query ReportCatalog {
    reportCatalog { key title description usesRange groupings }
  }
`);
