import { graphql } from "@/gql";

/** The reports this person may run, with their favourites and when they last opened each. */
export const ReportCatalogDocument = graphql(`
  query ReportCatalog {
    reportCatalog { key title description usesRange groupings category favorite lastViewed }
  }
`);

/** Custom reports this person made, and those shared with the company. */
export const CustomReportsDocument = graphql(`
  query CustomReports {
    customReports { id name description fields filter showing shared ownerName mine favorite lastViewed }
  }
`);

export const SetFavoriteReportDocument = graphql(`
  mutation SetFavoriteReport($favorite: Boolean!, $key: String, $customId: ID) {
    setFavoriteReport(favorite: $favorite, key: $key, customId: $customId)
  }
`);

/** The order standard report groups appear in. */
export const CATEGORIES = ["Headcount and turnover", "Employee info", "Compensation", "Benefits", "Time off", "Data review"];
