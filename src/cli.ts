// This is a command line tool to search patients by email address.

import { PatientSearch } from "./patient-search/patient-search";

// Reading command line arguments
const [...emails] = process.argv.slice(2);
if (!emails || emails.length === 0) {
  console.error("Please provide an email address or multiple email addresses.");
  process.exit(1);
}
for (let email of emails) {
  if (!email.includes("@")) {
    console.error("Invalid email address.");
    email = "";
  }

  if (email !== undefined && email !== "") {
    console.log(`Searching for ${email}...`);

    const patientSearch = new PatientSearch();
    const results = await patientSearch.search(email);

    if (results.length === 0) {
      console.log(`Couldn't find any patient with email address ${email}.`);
    } else {
      console.log(
        `Found ${results.length} patients with email address ${email}:`
      );
      results.forEach((result) => {
        console.log(result);
      });
    }
  }

  console.log("");
}

process.exit(0);
