-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2025 at 04:10 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `recipes`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Breakfast'),
(4, 'Desserts'),
(5, 'Drinks'),
(2, 'Entree'),
(6, 'Ingredients'),
(3, 'Snacks');

-- --------------------------------------------------------

--
-- Table structure for table `dishes`
--

CREATE TABLE `dishes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dishes`
--

INSERT INTO `dishes` (`id`, `name`, `category_id`) VALUES
(1, 'Ham and Cheese Omelet', 1),
(2, 'Blueberry Parfait', 1),
(3, 'Roasted Curry Chickpeas', 3),
(4, 'Homemade Granola Bars', 3),
(6, 'Braised Pork Belly', 2),
(7, 'Steak Stir Fry', 2),
(8, 'Chocolate Chip Cookies', 4),
(9, 'Shirley Temple', 5),
(10, 'Apple Pie', 4),
(30, 'Fluffy Pancakes', 1);

-- --------------------------------------------------------

--
-- Table structure for table `dish_images`
--

CREATE TABLE `dish_images` (
  `id` int(11) NOT NULL,
  `dish_id` int(11) DEFAULT NULL,
  `image_filename` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dish_images`
--

INSERT INTO `dish_images` (`id`, `dish_id`, `image_filename`) VALUES
(11, 10, 'Applepie.jpg'),
(12, 2, 'BlueberryParfait.webp'),
(13, 6, '1747691792357-BraisedPorkbelly.JPG'),
(15, 8, 'ChocolateChipCookie.webp'),
(16, 1, 'HamCheeseOmelete.jpg'),
(17, 4, 'GranolaBars.jpg'),
(18, 3, 'RoastedCurryChickpeas.webp'),
(19, 9, 'ShirleyTemple.JPG'),
(20, 7, 'SteatStirFry.jpg'),
(35, 30, '1747706045528-1747458916879-Pancakes.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `dish_ingredients`
--

CREATE TABLE `dish_ingredients` (
  `dish_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT 1.00,
  `unit_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dish_ingredients`
--

INSERT INTO `dish_ingredients` (`dish_id`, `ingredient_id`, `quantity`, `unit_id`) VALUES
(1, 13, 1.00, 6),
(1, 16, 1.00, 6),
(1, 36, 2.00, NULL),
(2, 8, 1.00, 1),
(2, 17, 0.50, 1),
(2, 18, 0.50, 1),
(3, 21, 1.00, 1),
(3, 25, 1.00, 2),
(3, 37, 1.00, 1),
(4, 19, 2.00, 1),
(4, 20, 0.50, 1),
(4, 24, 0.50, 1),
(4, 29, 0.25, 1),
(6, 4, 2.00, 16),
(6, 23, 0.50, 15),
(6, 26, 1.00, 2),
(6, 39, 1.00, 17),
(7, 1, 1.00, 1),
(7, 2, 1.00, 5),
(7, 4, 0.50, 4),
(7, 15, 1.00, 1),
(7, 26, 2.00, 2),
(7, 27, 1.00, 3),
(7, 39, 2.00, 5),
(8, 21, 1.25, 1),
(8, 22, 0.75, 1),
(8, 23, 1.00, 1),
(8, 24, 0.50, 1),
(8, 28, 1.00, 3),
(8, 36, 0.50, NULL),
(9, 10, 0.50, 1),
(9, 30, 2.00, 2),
(9, 31, 1.00, 2),
(10, 9, 4.00, NULL),
(10, 21, 0.75, 1),
(10, 22, 1.00, 1),
(10, 23, 1.50, 1),
(10, 32, 0.50, 1),
(30, 21, 3.00, 2),
(30, 22, 1.00, 1),
(30, 23, 1.00, 2),
(30, 28, 2.00, 3),
(30, 36, 1.00, NULL),
(30, 75, 3.00, 3),
(30, 76, 1.00, 3),
(30, 77, 1.00, 15);

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`id`, `name`) VALUES
(9, 'Apples'),
(75, 'baking powder'),
(1, 'Bell Peppers'),
(8, 'Blueberries'),
(2, 'Broccoli'),
(21, 'Butter'),
(16, 'Cheese'),
(10, 'Cherries'),
(37, 'chickpea'),
(24, 'Chocolate Chips'),
(32, 'Cinnamon'),
(27, 'Cornstarch'),
(25, 'Curry Powder'),
(36, 'Egg'),
(22, 'Flour'),
(4, 'Garlic'),
(18, 'Granola'),
(31, 'Grenadine'),
(13, 'Ham'),
(20, 'Honey'),
(30, 'Lemon-Lime Soda'),
(77, 'milk'),
(19, 'Oats'),
(39, 'onion'),
(29, 'Peanut Butter'),
(76, 'salt'),
(26, 'Soy Sauce'),
(15, 'Steak'),
(23, 'Sugar'),
(28, 'Vanilla'),
(17, 'Yogurt');

-- --------------------------------------------------------

--
-- Table structure for table `instruction_steps`
--

CREATE TABLE `instruction_steps` (
  `id` int(11) NOT NULL,
  `dish_id` int(11) NOT NULL,
  `step_number` int(11) NOT NULL,
  `content` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `instruction_steps`
--

INSERT INTO `instruction_steps` (`id`, `dish_id`, `step_number`, `content`) VALUES
(296, 2, 1, 'Spoon a layer of yogurt into a glass.'),
(297, 2, 2, 'Add a layer of blueberries.'),
(298, 2, 3, 'Add a layer of granola.'),
(299, 2, 4, 'Repeat layers and top with blueberries and granola.'),
(300, 2, 5, 'Chill for 5-10 minutes before serving.'),
(307, 4, 1, 'Mix oats, peanut butter, and honey.'),
(308, 4, 2, 'Stir in chocolate chips.'),
(309, 4, 3, 'Press mixture into a parchment-lined pan.'),
(310, 4, 4, 'Refrigerate for 1 hour.'),
(311, 4, 5, 'Cut into bars and store.'),
(323, 7, 1, 'Heat oil in wok or skillet.'),
(324, 7, 2, 'Add garlic and onions, stir-fry 1 minute.'),
(325, 7, 3, 'Add steak and cook until browned.'),
(326, 7, 4, 'Add broccoli and bell peppers, stir-fry 2-3 minutes.'),
(327, 7, 5, 'Add soy sauce and cornstarch slurry.'),
(328, 7, 6, 'Cook until sauce thickens and serve.'),
(329, 8, 1, 'Preheat oven to 350F.'),
(330, 8, 2, 'Cream butter and sugar.'),
(331, 8, 3, 'Add egg and vanilla.'),
(332, 8, 4, 'Stir in flour.'),
(333, 8, 5, 'Fold in chocolate chips.'),
(334, 8, 6, 'Drop spoonfuls on baking sheet.'),
(335, 8, 7, 'Bake for 10-12 minutes.'),
(336, 8, 8, 'Cool on wire rack.'),
(342, 10, 1, 'Preheat oven to 375F.'),
(343, 10, 2, 'Toss apple slices with sugar and cinnamon.'),
(344, 10, 3, 'Prepare or use pre-made pie crust.'),
(345, 10, 4, 'Fill crust with apple mixture.'),
(346, 10, 5, 'Add top crust or lattice.'),
(347, 10, 6, 'Bake for 45-50 minutes.'),
(348, 10, 7, 'Cool before slicing.'),
(461, 9, 1, 'Fill glass with ice.'),
(462, 9, 2, 'Pour in lemon-lime soda.'),
(463, 9, 3, 'Add grenadine and cherry juice.'),
(464, 9, 4, 'Stir gently.'),
(465, 9, 5, 'Top with cherry and serve.'),
(466, 9, 6, 'Drink'),
(536, 3, 1, 'Preheat oven to 400F.'),
(537, 3, 2, 'Dry chickpeas with a paper towel.'),
(538, 3, 3, 'Toss chickpeas with oil, curry powder, and salt.'),
(539, 3, 4, 'Spread on a baking sheet in a single layer.'),
(540, 3, 5, 'Roast for 25 minutes, shaking halfway.'),
(541, 3, 6, 'Toss with melted butter and serve warm.'),
(587, 1, 1, 'Whisk eggs.'),
(588, 1, 2, 'Heat a pan over medium heat.'),
(589, 1, 3, 'Pour eggs into the pan.'),
(590, 1, 4, 'Add ham and cheese.'),
(591, 1, 5, 'Fold the omelet when cooked.'),
(616, 6, 1, 'Sear pork belly until browned.'),
(617, 6, 2, 'Remove pork and set aside.'),
(618, 6, 3, 'Saute onions and garlic in pot.'),
(619, 6, 4, 'Return pork, add soy sauce, sugar, and water.'),
(620, 6, 5, 'Simmer on low for 2 hours.'),
(621, 6, 6, 'Serve over steamed rice.'),
(741, 30, 1, 'In a large bowl, sift together the flour, baking powder, sugar, and salt.'),
(742, 30, 2, 'Make a well in the center and pour in the milk, egg, and melted butter.'),
(743, 30, 3, 'Mix until smooth — don’t overmix.'),
(744, 30, 4, 'Heat a lightly oiled griddle or frying pan over medium-high heat.'),
(745, 30, 5, 'Pour or scoop the batter onto the pan, using about 1/4 cup for each pancake.'),
(746, 30, 6, 'Cook until bubbles appear on the surface, then flip and cook until golden brown on the other side.'),
(747, 30, 7, 'Serve warm with syrup, fruit, or whipped cream.');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `dish_id` int(11) NOT NULL,
  `prep_time_minutes` int(11) DEFAULT NULL,
  `cook_time_minutes` int(11) DEFAULT NULL,
  `servings` int(11) DEFAULT NULL,
  `instructions` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`dish_id`, `prep_time_minutes`, `cook_time_minutes`, `servings`, `instructions`) VALUES
(1, 5, 10, 2, 'Step 1: Whisk eggs. Step 2: Heat a pan over medium heat. Step 3: Pour eggs into the pan. Step 4: Add ham and cheese. Step 5: Fold the omelet when cooked.'),
(2, 10, 0, 2, 'In a clear glass or dessert cup, spoon a layer of yogurt to cover the bottom. Add a layer of blueberries, then a layer of granola. Repeat these layers until the cup is full, finishing with a few blueberries and a sprinkle of granola on top. Chill for 5-10 minutes before serving.'),
(3, 5, 25, 4, 'Preheat the oven to 400F. Spread the chickpeas on a paper towel and pat dry. In a bowl, toss them with olive oil, curry powder, and salt until evenly coated. Spread them on a baking sheet in a single layer and roast for 25 minutes, shaking the pan halfway through. Once golden and crispy, toss them with a bit of melted butter and serve warm.'),
(4, 15, 0, 12, 'In a large bowl, mix oats, peanut butter, and honey until combined. Stir in the chocolate chips. Press the mixture firmly into a parchment-lined baking pan using a spatula or your hands. Refrigerate for at least 1 hour, then cut into bars and store in an airtight container.'),
(6, 15, 120, 4, 'Sear the pork belly in a hot pan until browned on all sides. Remove and set aside. In a large pot, add onions and garlic, and saute briefly. Return the pork belly, add soy sauce, sugar, and enough water to cover. Simmer on low heat for 2 hours until the pork is tender and the sauce has reduced. Serve over steamed rice.'),
(7, 20, 10, 4, 'In a wok or skillet, heat oil over high heat. Add garlic and onions and stir-fry for 1 minute. Add the steak and cook until just browned. Toss in broccoli and bell peppers, cooking for another 2-3 minutes. Mix soy sauce and cornstarch with a splash of water, then add to the pan. Cook until the sauce thickens. Serve hot.'),
(8, 15, 12, 24, 'Preheat oven to 350F. In a bowl, cream together butter and sugar. Add egg and vanilla, then mix well. Gradually stir in flour, then fold in chocolate chips. Drop spoonfuls onto a baking sheet and bake for 10-12 minutes until edges are golden. Cool on a wire rack.'),
(9, 10, 0, 1, 'Step 1: Fill glass with ice. Step 2: Pour in lemon-lime soda. Step 3: Add grenadine and cherry juice. Step 4: Stir gently. Step 5: Top with cherry and serve. Step 6: Drink'),
(10, 30, 50, 8, 'Step 1: Preheat oven to 375°F.\nStep 2: Toss apple slices with sugar and cinnamon.\nStep 3: Prepare or use pre-made pie crust.\nStep 4: Fill crust with apple mixture.\nStep 5: Add top crust or lattice.\nStep 6: Bake for 45-50 minutes.\nStep 7: Cool before slicing.'),
(30, 1, 10, 4, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `name`) VALUES
(12, ''),
(10, 'apples'),
(11, 'bell peppers'),
(16, 'clove'),
(4, 'cloves'),
(15, 'cup'),
(1, 'cups'),
(9, 'eggs'),
(7, 'lbs'),
(8, 'oz'),
(17, 'piece'),
(5, 'pieces'),
(6, 'slices'),
(2, 'tbsp'),
(14, 'tbsps'),
(3, 'tsp'),
(13, 'tsps');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `dishes`
--
ALTER TABLE `dishes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `fk_dishes_category` (`category_id`);

--
-- Indexes for table `dish_images`
--
ALTER TABLE `dish_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dish_id` (`dish_id`);

--
-- Indexes for table `dish_ingredients`
--
ALTER TABLE `dish_ingredients`
  ADD PRIMARY KEY (`dish_id`,`ingredient_id`),
  ADD KEY `ingredient_id` (`ingredient_id`),
  ADD KEY `fk_unit` (`unit_id`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `unique_ingredient_name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`);

--
-- Indexes for table `instruction_steps`
--
ALTER TABLE `instruction_steps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dish_id` (`dish_id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`dish_id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `unique_unit_name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `dishes`
--
ALTER TABLE `dishes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `dish_images`
--
ALTER TABLE `dish_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `instruction_steps`
--
ALTER TABLE `instruction_steps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=748;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dishes`
--
ALTER TABLE `dishes`
  ADD CONSTRAINT `fk_dishes_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `dish_images`
--
ALTER TABLE `dish_images`
  ADD CONSTRAINT `dish_images_ibfk_1` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`);

--
-- Constraints for table `dish_ingredients`
--
ALTER TABLE `dish_ingredients`
  ADD CONSTRAINT `dish_ingredients_ibfk_1` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`),
  ADD CONSTRAINT `dish_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`),
  ADD CONSTRAINT `fk_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`);

--
-- Constraints for table `instruction_steps`
--
ALTER TABLE `instruction_steps`
  ADD CONSTRAINT `instruction_steps_ibfk_1` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
