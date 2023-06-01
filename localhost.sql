-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 13, 2023 at 08:18 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hcm`
--
CREATE DATABASE IF NOT EXISTS `hcm` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `hcm`;

-- --------------------------------------------------------
--
-- Table structure for table `emp_table`
--

CREATE TABLE `emp_table` (
  `id` int(5) NOT NULL,
  `emp_id` text NOT NULL,
  `emp_surname` text NOT NULL,
  `emp_firstname` text NOT NULL,
  `emp_middlename` text NOT NULL,
  `emp_gender` text NOT NULL,
  `emp_dob` date NOT NULL,
  `emp_email` text NOT NULL,
  `emp_currentgrade` text DEFAULT NULL,
  `emp_dateoffirstappointment` date DEFAULT NULL,
  `emp_dateofpresentappointment` date DEFAULT NULL,
  `emp_highestqualification` text DEFAULT NULL,
  `emp_staffstatus` text DEFAULT NULL,
  `emp_yearswithministry` int(2) DEFAULT NULL,
  `emp_maritalstatus` text DEFAULT NULL,
  `emp_phoneno` text NOT NULL,
  `CreatedOn` date DEFAULT current_timestamp(),
  `UpdatedOn` date DEFAULT NULL,
  `CreatedBy` text DEFAULT NULL,
  `UpdatedBy` text DEFAULT NULL,
  `photo` text DEFAULT NULL,
  `unit_id` int(5) DEFAULT NULL,
  `exit_id` tinyint(1) NOT NULL DEFAULT 0,
  `status` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emp_table`
--

INSERT INTO `emp_table` (`id`, `emp_id`, `emp_surname`, `emp_firstname`, `emp_middlename`, `emp_gender`, `emp_dob`, `emp_email`, `emp_currentgrade`, `emp_dateoffirstappointment`, `emp_dateofpresentappointment`, `emp_highestqualification`, `emp_staffstatus`, `emp_yearswithministry`, `emp_maritalstatus`, `emp_phoneno`, `CreatedOn`, `UpdatedOn`, `CreatedBy`, `UpdatedBy`, `photo`, `unit_id`, `exit_id`, `status`) VALUES
(1, 'H2020435', 'Appiah Dadzie', 'Joshua', '', 'Male', '1980-09-13', '1email@gm.co', 'AII', '2010-11-11', '2015-11-11', 'Bachelor Degree', 'Senior Staff', 7, 'Single', '0234958394', '0000-00-00', '2021-01-05', 'Joshua Appiah Dadzie', 'Joshua Appiah Dadzie', 'avatar.png', 1, 0, 0),
(2, 'Emp65294', 'Lebron', 'King', 'James', 'Male', '1989-10-10', 'em1ail@gm.co', 'High', '2012-11-11', '2016-11-11', 'HND', ' Junior Staff', 2, 'Single', '0293848344', '2020-11-17', '2021-07-25', 'Joshua Appiah Dadzie', 'Joshua Appiah Dadzie', 'avatar2.png', 1, 0, 0),
(4, 'Emp6529', 'Dadzie', 'Joshua', 'Kubi', 'Female', '2021-07-01', 'joshuaagyemang1@gmail.com', 'azdfs', '2021-07-07', '2021-07-02', 'adsas', ' sada', 0, 'Single', '3222222222', '2021-07-25', NULL, 'Joshua  Appiah Dadzie', NULL, '', 4, 0, 1),
(5, 'H2021435', 'Kubi', 'John', '', 'Male', '1980-09-13', 'email@gm.com', 'AII', '2010-11-11', '2015-11-11', 'Bachelor Degree', 'Senior Staff', 7, 'Single', '0234958394', '0000-00-00', '2021-01-05', 'Joshua Appiah Dadzie', 'Joshua Appiah Dadzie', 'avatar4.png', 1, 0, 0),
(14, 'EM23456', 'Essien', 'Joe', 'Mark', 'Female', '1989-05-02', 'ty@mail.com', NULL, NULL, NULL, 'high', 'Junior Staff', 3, 'Single', '0234567544', '2023-05-13', NULL, NULL, NULL, 'dummy.png', 4, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `exits_table`
--

CREATE TABLE `exits_table` (
  `id` int(5) NOT NULL,
  `emp_id` text NOT NULL,
  `exit_date` date NOT NULL,
  `reason` text NOT NULL,
  `CreatedOn` date NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `postings_table`
--

CREATE TABLE `postings_table` (
  `id` int(5) NOT NULL,
  `emp_id` text NOT NULL,
  `post_from` text NOT NULL,
  `post_to` text NOT NULL,
  `region` text NOT NULL,
  `effectiveDate` date NOT NULL,
  `releaseDate` date NOT NULL,
  `assumptionDate` date NOT NULL,
  `CreatedOn` date NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` text NOT NULL DEFAULT ' '
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `postings_table`
--

INSERT INTO `postings_table` (`id`, `emp_id`, `post_from`, `post_to`, `region`, `effectiveDate`, `releaseDate`, `assumptionDate`, `CreatedOn`, `CreatedBy`) VALUES
(1, 'Emp65294', '', '', '', '2021-06-22', '2021-06-22', '2021-06-22', '2021-06-22', 'Joshua Appiah Dadzie'),
(4, 'H2021435', 'HR', 'IT', 'Ashanti', '2023-05-12', '2023-05-12', '2023-05-15', '2023-05-13', ' '),
(5, 'Emp6529', 'FD', 'PD', 'try', '2023-05-12', '2023-05-12', '2023-05-15', '2023-05-13', ' '),
(6, 'H2021435', 'HR', 'Procurement', 'Ashanti', '2023-05-12', '2023-05-12', '2023-05-15', '2023-05-13', ' ');

-- --------------------------------------------------------

--
-- Table structure for table `promotions_table`
--

CREATE TABLE `promotions_table` (
  `id` int(5) NOT NULL,
  `emp_id` text NOT NULL,
  `promotion_history` text NOT NULL,
  `notional_date` date NOT NULL,
  `substantive_date` date NOT NULL,
  `CreatedOn` date NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `promotions_table`
--

INSERT INTO `promotions_table` (`id`, `emp_id`, `promotion_history`, `notional_date`, `substantive_date`, `CreatedOn`, `CreatedBy`) VALUES
(2, 'Emp65294', 'I dont know', '2021-06-15', '2021-06-30', '2021-06-22', 'Joshua  Appiah Dadzie');

-- --------------------------------------------------------

--
-- Table structure for table `promotion_history`
--

CREATE TABLE `promotion_history` (
  `id` int(5) NOT NULL,
  `emp_id` text NOT NULL,
  `from_place` text NOT NULL,
  `to_place` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `createdOn` date NOT NULL,
  `createdBy` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `promotion_history`
--

INSERT INTO `promotion_history` (`id`, `emp_id`, `from_place`, `to_place`, `start_date`, `end_date`, `createdOn`, `createdBy`) VALUES
(1, 'Emp65294', 'gh', 'gh', '2021-06-23', '2021-06-26', '2021-06-25', 'Joshua  Appiah Dadzie'),
(2, 'Emp65294', 'gh1', 'gh', '2021-06-23', '2021-06-26', '2021-06-25', 'Joshua  Appiah Dadzie');

-- --------------------------------------------------------

--
-- Table structure for table `units_table`
--

CREATE TABLE `units_table` (
  `unit_id` int(5) NOT NULL,
  `Name` text NOT NULL,
  `CreatedOn` date NOT NULL DEFAULT current_timestamp(),
  `UpdateOn` date NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` text NOT NULL DEFAULT ' ',
  `UpdatedBy` text NOT NULL DEFAULT ' '
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `units_table`
--

INSERT INTO `units_table` (`unit_id`, `Name`, `CreatedOn`, `UpdateOn`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 'Human Resource Directorate', '2020-11-16', '0000-00-00', 'Joshua Appiah Dadzie', ''),
(2, 'Internal Audit', '2020-11-16', '0000-00-00', 'Joshua Appiah Dadzie', ''),
(3, 'Procurement and Stores', '2020-11-16', '0000-00-00', 'Joshua Appiah Dadzie', ''),
(4, 'Estates', '2020-11-16', '0000-00-00', 'Joshua Appiah Dadzie', ''),
(5, 'Personnel', '2020-11-16', '0000-00-00', 'Joshua Appiah Dadzie', ''),
(6, 'Transport', '2020-11-16', '0000-00-00', 'Joshua Appiah Dadzie', ''),
(7, 'Records/Registry & Secretariaship', '2020-11-16', '0000-00-00', 'Joshua Appiah Dadzie', ''),
(13, 'Sanitry & Security', '2020-11-16', '0000-00-00', 'Joshua Appiah Dadzie', ''),
(14, 'Research Statistics and Information Management Directorate', '2020-11-16', '0000-00-00', 'Joshua Appiah Dadzie', ''),
(27, 'New Unit', '2023-05-13', '2023-05-13', ' ', ' '),
(28, 'Unit 1', '2023-05-13', '2023-05-13', ' ', ' ');

-- --------------------------------------------------------

--
-- Table structure for table `users_table`
--

CREATE TABLE `users_table` (
  `user_id` int(5) NOT NULL,
  `emp_id` text NOT NULL,
  `password` varchar(100) NOT NULL,
  `user_type` text NOT NULL,
  `status` tinyint(1) DEFAULT 0,
  `CreatedOn` date NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` text NOT NULL DEFAULT ' '
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_table`
--

INSERT INTO `users_table` (`user_id`, `emp_id`, `password`, `user_type`, `status`, `CreatedOn`, `CreatedBy`) VALUES
(1, 'H2020435', '$2y$10$eM49mcPlLsLSjtQcRqWQRuW.RDWcCK6Eiyx832hChgRkrhKgqCLmK', 'admin', 0, '0000-00-00', 'Joshua Appiah Dadzie'),
(2, 'Emp65294', '$2y$10$rVKiCXcd2DiJNZkx9bEmOO0qJ2JuMHmlvTm1fqghCdMXXHtC.coAu', 'user', 0, '2020-11-17', 'Joshua Appiah Dadzie');

--
-- Indexes for dumped tables

--
-- Indexes for table `emp_table`
--
ALTER TABLE `emp_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exits_table`
--
ALTER TABLE `exits_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `postings_table`
--
ALTER TABLE `postings_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promotions_table`
--
ALTER TABLE `promotions_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promotion_history`
--
ALTER TABLE `promotion_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `units_table`
--
ALTER TABLE `units_table`
  ADD PRIMARY KEY (`unit_id`);

--
-- Indexes for table `users_table`
--
ALTER TABLE `users_table`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `emp_table`
--
ALTER TABLE `emp_table`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `exits_table`
--
ALTER TABLE `exits_table`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `postings_table`
--
ALTER TABLE `postings_table`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `promotions_table`
--
ALTER TABLE `promotions_table`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `promotion_history`
--
ALTER TABLE `promotion_history`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `units_table`
--
ALTER TABLE `units_table`
  MODIFY `unit_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `users_table`
--
ALTER TABLE `users_table`
  MODIFY `user_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
