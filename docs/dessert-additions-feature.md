# General Premise

For the admin dashboard we not  only want it to show business analytics, but we also want it to be used as a place to configure and add content onto the website. Admins should be able to edit descriptions, change prices, swap out images, and change the ordering of items and categories of the listed desserts

# Features to Implement

1. visual card components that each show a category of dessert, and have a list of the desserts in the database that fit in that category
    1. paginated table (max limit of 10 items per page) that should show name, short description, price, if it's active, and if it's sold out 
    2. In the visual card displaying this table, there should be an add button in the top right corner of the visual card to allow admins to create new desserts, and on the leftmost side of each row displaying dessert, have an edit button that takes you to the dessert edit screen
2. Dessert Add/Edit Screen
    1. Form-like page or modal that allows admins to fill in the necessary information to add or edit dessert information
    2. Admins should have the option to fill in all relevant fields from the desserts table
    3. To start for now, these fields should be required on creation:
        - name
        - price
        - description
        - shortDescription
        - price 
        - category
        - inventoryCount
    4. On an edit, if any of the required fields are made blank, you should not be allowed to save until there is information populated in the required fields
