import User from "./dist/models/userModel.js";
import Organisation from "./dist/models/orgModel.js";

const userWithOrganisations = await User.findByPk(
  "9bbaf93d-8a74-4976-a812-6f973c5bdaf3",
  {
    include: Organisation,
  },
);

if (!userWithOrganisations) {
  throw new Error("User not found");
}

console.log(userWithOrganisations.organisations); // Accessing associated organisations
