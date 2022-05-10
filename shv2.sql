-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 10, 2022 at 10:21 AM
-- Server version: 5.7.34
-- PHP Version: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shv2`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` bigint(20) NOT NULL,
  `createdBy` bigint(20) NOT NULL,
  `title` varchar(75) NOT NULL,
  `summary` tinytext,
  `eventDate` date DEFAULT NULL,
  `eventTime` time DEFAULT NULL,
  `status` smallint(6) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `createdBy`, `title`, `summary`, `eventDate`, `eventTime`, `status`, `createdAt`, `updatedAt`) VALUES
(8, 1, 'example event title', 'example event description', '2022-07-20', '10:15:00', 0, '2022-05-04 09:18:17', '2022-05-04 09:18:17'),
(9, 1, '2nd example event', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dictum massa ligula, a viverra risus feugiat in. Duis lectus quam, porta nec mi id, lacinia varius urna. Donec pellentesque turpis id nulla sollicitudin elementum. ', '2022-05-27', '18:30:00', 0, '2022-05-04 12:25:16', '2022-05-04 12:25:16'),
(11, 2, 'A really long title to test the where the character limit should be set', 'lorem ipsum blah blah blah', '2022-05-06', '16:00:00', 0, '2022-05-04 16:00:30', '2022-05-04 16:00:30');

-- --------------------------------------------------------

--
-- Table structure for table `event_member`
--

CREATE TABLE `event_member` (
  `id` bigint(20) NOT NULL,
  `eventId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `type` smallint(6) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `event_member`
--

INSERT INTO `event_member` (`id`, `eventId`, `userId`, `type`, `createdAt`, `updatedAt`) VALUES
(109, 8, 1, 0, '2022-05-04 11:18:01', '2022-05-04 11:18:01'),
(111, 8, 2, 0, '2022-05-04 12:45:19', '2022-05-04 12:45:19'),
(120, 8, 3, 0, '2022-05-09 12:05:25', '2022-05-09 12:05:25'),
(124, 9, 1, 0, '2022-05-09 16:29:14', '2022-05-09 16:29:14');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `registeredAt` datetime NOT NULL,
  `lastLogin` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `firstName`, `lastName`, `email`, `passwordHash`, `registeredAt`, `lastLogin`) VALUES
(1, 'Adam', 'Merritt', 'adam.merritt@two-uk.com', '$2b$10$LuJ5aiUPZQvxpxKBy4gdleuJFnVJdOkozY6D2y6NH7U0zFsidc74q', '2022-03-07 11:19:26', '2022-05-09 13:05:51'),
(2, 'Bob', 'Ross', 'bob.ross@two-uk.com', '$2b$10$AAQXheK.9/yGJWLy/FuJ7.lVwb5kyFMbRpObXVqn.KlSY8NgN8svK', '2022-05-03 13:01:09', '2022-05-04 15:58:21'),
(3, 'John', 'Smith', 'john.smith@two-uk.com', '$2b$10$dbmE.MP6rYxCtIyTesM7uuhJDvSmIDFCSuDJE23OEICrziXpjqDxu', '2022-05-09 12:04:34', '2022-05-09 12:04:52'),
(4, 'Chuck', 'Norris', 'chuck.norris@two-uk.com', '$2b$10$nhjFhiTIL314eliT97rdBuf1UYSxCiFmM2haR5hwaG7MKDEQKc4Ky', '2022-05-09 12:09:26', '2022-05-09 12:09:40'),
(5, 'Jackie', 'Chang', 'jackie.chang@two-uk.com', '$2b$10$FRclDanSUi/p2dkAXMnG2uetjSLsdafzY3NhoU/n60ARMKZwtTv4m', '2022-05-09 12:18:53', '2022-05-09 12:19:20'),
(6, 'Tony', 'Stark', 'tony.stark@two-uk.com', '$2b$10$tBfvyJs8PAwBFDqwtJ3dyeqqswRmcMLGSOOynhVTHc5XMmZWdqkL6', '2022-05-09 12:25:42', '2022-05-09 12:25:42'),
(7, 'Bruce', 'Wayne', 'bruce.wayne@two-uk.com', '$2b$10$U14DEzAFdKXW5VHbiQmZde2y9bYVJTfw.KIWg1leqZNSrdcwlEz96', '2022-05-09 12:26:54', '2022-05-09 12:26:54'),
(8, 'Woody', 'Woodpecker', 'woody.woodpecker@two-uk.com', '$2b$10$ebZaoC4LQPRdx.vlljVFWOSv/Dsq.0JEkCVLp4Qv7CSR3rErHt1du', '2022-05-09 13:01:34', '2022-05-09 13:02:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_group_creator` (`createdBy`);

--
-- Indexes for table `event_member`
--
ALTER TABLE `event_member`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_friend` (`eventId`,`userId`),
  ADD KEY `idx_member_event` (`eventId`),
  ADD KEY `idx_member_user` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `event_member`
--
ALTER TABLE `event_member`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fk_group_creator` FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `event_member`
--
ALTER TABLE `event_member`
  ADD CONSTRAINT `fk_member_event` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_member_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
