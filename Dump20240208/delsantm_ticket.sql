-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: delsantm
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticketno` varchar(45) DEFAULT NULL,
  `proid` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `envid` int(11) DEFAULT NULL,
  `eventid` int(11) DEFAULT NULL,
  `rp` varchar(45) DEFAULT NULL,
  `module` varchar(45) DEFAULT NULL,
  `app` varchar(45) DEFAULT NULL,
  `classid` int(11) DEFAULT NULL,
  `issue` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `timeline` date DEFAULT NULL,
  `dateend` date NOT NULL,
  `datecomplete` date DEFAULT NULL,
  `skipped` tinyint(4) DEFAULT NULL,
  `reoccur` int(11) DEFAULT NULL,
  `started` tinyint(4) DEFAULT NULL,
  `createdby` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`,`date`,`dateend`),
  KEY `idx_ticket_proid` (`proid`),
  KEY `idx_ticket_date` (`date`),
  KEY `idx_ticket_dateend` (`dateend`),
  KEY `idx_ticket_datecomplete` (`datecomplete`),
  KEY `idx_ticket_skipped` (`skipped`),
  KEY `idx_ticket_reoccur` (`reoccur`),
  KEY `idx_ticket_started` (`started`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
 PARTITION BY RANGE  COLUMNS(`date`,`dateend`)
(PARTITION `p0` VALUES LESS THAN ('2024-01-01','2024-01-01') ENGINE = InnoDB,
 PARTITION `p1` VALUES LESS THAN ('2025-01-01','2025-01-01') ENGINE = InnoDB,
 PARTITION `p2` VALUES LESS THAN (MAXVALUE,MAXVALUE) ENGINE = InnoDB);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
INSERT INTO `ticket` VALUES (4,'2023-12-234',6,'2023-12-23',8,8,'','','',66,'',NULL,NULL,'2023-12-21',NULL,NULL,NULL,NULL,NULL),(5,'2023-12-235',6,'2023-12-23',8,8,'','','',66,'',NULL,NULL,'2023-12-21',NULL,NULL,4,NULL,NULL),(6,'2023-12-236',6,'2023-12-23',8,8,'','','',66,'',NULL,NULL,'2023-12-22','2023-12-23',NULL,4,1,NULL),(8,NULL,3,'2024-01-04',12,12,'','','',61,'',NULL,NULL,'2024-01-12',NULL,NULL,NULL,NULL,NULL),(9,'2024-01-049',3,'2024-01-04',9,12,'','','',61,'',NULL,NULL,'2024-01-12','2024-01-04',1,NULL,NULL,NULL),(10,'2024-01-0410',12,'2024-01-04',8,9,'','','',53,'',NULL,NULL,'2024-01-17',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-08 23:33:31
