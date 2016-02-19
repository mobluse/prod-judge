-- phpMyAdmin SQL Dump
-- version 3.2.0.1
-- http://www.phpmyadmin.net
--
-- Värd: localhost
-- Skapad: 15 december 2009 kl 11:36
-- Serverversion: 5.1.36
-- PHP-version: 5.3.0

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databas: `prodjudge`
--

-- --------------------------------------------------------

--
-- Struktur för tabell `pj_axis`
--

CREATE TABLE IF NOT EXISTS `pj_axis` (
  `qid` int(11) NOT NULL,
  `dimension` varchar(140) COLLATE utf8_swedish_ci NOT NULL,
  `left` varchar(140) COLLATE utf8_swedish_ci NOT NULL,
  `right` varchar(140) COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`qid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Data i tabell `pj_axis`
--

INSERT INTO `pj_axis` (`qid`, `dimension`, `left`, `right`) VALUES
(1, 'Appetising, tasty', 'Least', 'Most'),
(2, 'Functional, practical', 'Least', 'Most'),
(3, 'Appealing, attractive', 'Least', 'Most'),
(4, 'Comfortable, ergonomic', 'Least', 'Most'),
(5, '”Suits public environments”, institutional', 'Least', 'Most'),
(6, 'Modern, trendy', 'Least', 'Most'),
(7, 'Unique, distinctive, characteristic', 'Least', 'Most');

-- --------------------------------------------------------

--
-- Struktur för tabell `pj_images`
--

CREATE TABLE IF NOT EXISTS `pj_images` (
  `iid` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(140) COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci AUTO_INCREMENT=14 ;

--
-- Data i tabell `pj_images`
--

INSERT INTO `pj_images` (`iid`, `filename`) VALUES
(1, 'Faatoelj_A'),
(2, 'Faatoelj_B'),
(3, 'Faatoelj_C'),
(4, 'Faatoelj_D'),
(5, 'Faatoelj_E'),
(6, 'Faatoelj_F'),
(7, 'Faatoelj_G'),
(8, 'Faatoelj_H'),
(9, 'Faatoelj_I'),
(10, 'Faatoelj_J'),
(11, 'fr_apelsin'),
(12, 'fr_apple'),
(13, 'fr_banana');

-- --------------------------------------------------------

--
-- Struktur för tabell `pj_imagesanswers`
--

CREATE TABLE IF NOT EXISTS `pj_imagesanswers` (
  `iaid` int(11) NOT NULL AUTO_INCREMENT,
  `quid` int(11) NOT NULL,
  `iid` int(11) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  PRIMARY KEY (`iaid`),
  KEY `iid` (`iid`),
  KEY `quid` (`quid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci AUTO_INCREMENT=1 ;

--
-- Data i tabell `pj_imagesanswers`
--


-- --------------------------------------------------------

--
-- Struktur för tabell `pj_investigations`
--

CREATE TABLE IF NOT EXISTS `pj_investigations` (
  `inid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `name` varchar(140) COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`inid`),
  KEY `orgid` (`orgid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci AUTO_INCREMENT=2 ;

--
-- Data i tabell `pj_investigations`
--

INSERT INTO `pj_investigations` (`inid`, `orgid`, `name`) VALUES
(1, 1, 'Arm chairs');

-- --------------------------------------------------------

--
-- Struktur för tabell `pj_organization`
--

CREATE TABLE IF NOT EXISTS `pj_organization` (
  `orgid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(140) COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`orgid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci AUTO_INCREMENT=2 ;

--
-- Data i tabell `pj_organization`
--

INSERT INTO `pj_organization` (`orgid`, `name`) VALUES
(1, 'LTH');

-- --------------------------------------------------------

--
-- Struktur för tabell `pj_particip`
--

CREATE TABLE IF NOT EXISTS `pj_particip` (
  `inid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  KEY `inid` (`inid`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Data i tabell `pj_particip`
--


-- --------------------------------------------------------

--
-- Struktur för tabell `pj_questions`
--

CREATE TABLE IF NOT EXISTS `pj_questions` (
  `qid` int(11) NOT NULL AUTO_INCREMENT,
  `inid` int(11) NOT NULL,
  `text` varchar(140) COLLATE utf8_swedish_ci NOT NULL,
  `frontispiece` varchar(140) COLLATE utf8_swedish_ci DEFAULT NULL,
  `type` enum('prodstay','proddisa') COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`qid`),
  KEY `inid` (`inid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci AUTO_INCREMENT=8 ;

--
-- Data i tabell `pj_questions`
--

INSERT INTO `pj_questions` (`qid`, `inid`, `text`, `frontispiece`, `type`) VALUES
(1, 1, 'Assess the three fruits according to how you perceive them. Drag and drop the pictures along the line.', 'Before the real assessment starts, you will complete a test assessment.', 'prodstay'),
(2, 1, 'Assess the ten arm chairs according to how you perceive them. (1 of 6)', 'Now, the real assessment starts.', 'prodstay'),
(3, 1, 'Assess the ten arm chairs according to how you perceive them. (2 of 6)', NULL, 'prodstay'),
(4, 1, 'Assess the ten arm chairs according to how you perceive them. (3 of 6)', NULL, 'prodstay'),
(5, 1, 'Assess the ten arm chairs according to how you perceive them. (4 of 6)', NULL, 'prodstay'),
(6, 1, 'Assess the ten arm chairs according to how you perceive them. (5 of 6)', NULL, 'prodstay'),
(7, 1, 'Assess the ten arm chairs according to how you perceive them. (6 of 6)', NULL, 'prodstay');

-- --------------------------------------------------------

--
-- Struktur för tabell `pj_questionsimages`
--

CREATE TABLE IF NOT EXISTS `pj_questionsimages` (
  `qid` int(11) NOT NULL,
  `iid` int(11) NOT NULL,
  KEY `qid` (`qid`,`iid`),
  KEY `iid` (`iid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Data i tabell `pj_questionsimages`
--

INSERT INTO `pj_questionsimages` (`qid`, `iid`) VALUES
(1, 11),
(1, 12),
(1, 13),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(3, 6),
(3, 7),
(3, 8),
(3, 9),
(3, 10),
(4, 1),
(4, 2),
(4, 3),
(4, 4),
(4, 5),
(4, 6),
(4, 7),
(4, 8),
(4, 9),
(4, 10),
(5, 1),
(5, 2),
(5, 3),
(5, 4),
(5, 5),
(5, 6),
(5, 7),
(5, 8),
(5, 9),
(5, 10),
(6, 1),
(6, 2),
(6, 3),
(6, 4),
(6, 5),
(6, 6),
(6, 7),
(6, 8),
(6, 9),
(6, 10),
(7, 1),
(7, 2),
(7, 3),
(7, 4),
(7, 5),
(7, 6),
(7, 7),
(7, 8),
(7, 9),
(7, 10);

-- --------------------------------------------------------

--
-- Struktur för tabell `pj_questionsusers`
--

CREATE TABLE IF NOT EXISTS `pj_questionsusers` (
  `quid` int(11) NOT NULL AUTO_INCREMENT,
  `qid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `stored` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`quid`),
  KEY `qid` (`qid`,`uid`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci AUTO_INCREMENT=1 ;

--
-- Data i tabell `pj_questionsusers`
--


-- --------------------------------------------------------

--
-- Struktur för tabell `pj_servers`
--

CREATE TABLE IF NOT EXISTS `pj_servers` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(140) COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci AUTO_INCREMENT=2 ;

--
-- Data i tabell `pj_servers`
--

INSERT INTO `pj_servers` (`sid`, `name`) VALUES
(1, 'localhost/pj/');

-- --------------------------------------------------------

--
-- Struktur för tabell `pj_users`
--

CREATE TABLE IF NOT EXISTS `pj_users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(140) COLLATE utf8_swedish_ci NOT NULL,
  `firstname` varchar(140) COLLATE utf8_swedish_ci NOT NULL,
  `lastname` varchar(140) COLLATE utf8_swedish_ci NOT NULL,
  `password` varchar(140) COLLATE utf8_swedish_ci NOT NULL,
  `level` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  PRIMARY KEY (`uid`),
  KEY `sid` (`sid`),
  KEY `sid_2` (`sid`),
  KEY `sid_3` (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci AUTO_INCREMENT=1 ;

--
-- Data i tabell `pj_users`
--


--
-- Restriktioner för dumpade tabeller
--

--
-- Restriktioner för tabell `pj_axis`
--
ALTER TABLE `pj_axis`
  ADD CONSTRAINT `pj_axis_ibfk_1` FOREIGN KEY (`qid`) REFERENCES `pj_questions` (`qid`);

--
-- Restriktioner för tabell `pj_imagesanswers`
--
ALTER TABLE `pj_imagesanswers`
  ADD CONSTRAINT `pj_imagesanswers_ibfk_3` FOREIGN KEY (`iid`) REFERENCES `pj_images` (`iid`),
  ADD CONSTRAINT `pj_imagesanswers_ibfk_4` FOREIGN KEY (`quid`) REFERENCES `pj_questionsusers` (`quid`);

--
-- Restriktioner för tabell `pj_investigations`
--
ALTER TABLE `pj_investigations`
  ADD CONSTRAINT `pj_investigations_ibfk_2` FOREIGN KEY (`orgid`) REFERENCES `pj_organization` (`orgid`);

--
-- Restriktioner för tabell `pj_particip`
--
ALTER TABLE `pj_particip`
  ADD CONSTRAINT `pj_particip_ibfk_1` FOREIGN KEY (`inid`) REFERENCES `pj_investigations` (`inid`),
  ADD CONSTRAINT `pj_particip_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `pj_users` (`uid`);

--
-- Restriktioner för tabell `pj_questions`
--
ALTER TABLE `pj_questions`
  ADD CONSTRAINT `pj_questions_ibfk_1` FOREIGN KEY (`inid`) REFERENCES `pj_investigations` (`inid`);

--
-- Restriktioner för tabell `pj_questionsimages`
--
ALTER TABLE `pj_questionsimages`
  ADD CONSTRAINT `pj_questionsimages_ibfk_1` FOREIGN KEY (`qid`) REFERENCES `pj_questions` (`qid`),
  ADD CONSTRAINT `pj_questionsimages_ibfk_2` FOREIGN KEY (`iid`) REFERENCES `pj_images` (`iid`);

--
-- Restriktioner för tabell `pj_questionsusers`
--
ALTER TABLE `pj_questionsusers`
  ADD CONSTRAINT `pj_questionsusers_ibfk_1` FOREIGN KEY (`qid`) REFERENCES `pj_questions` (`qid`),
  ADD CONSTRAINT `pj_questionsusers_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `pj_users` (`uid`);

--
-- Restriktioner för tabell `pj_users`
--
ALTER TABLE `pj_users`
  ADD CONSTRAINT `pj_users_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `pj_servers` (`sid`);
