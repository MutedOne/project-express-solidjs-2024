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
-- Table structure for table `ticketapp`
--

DROP TABLE IF EXISTS `ticketapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticketapp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticketid` int(11) DEFAULT NULL,
  `deptid` int(11) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `note` varchar(100) DEFAULT 'None',
  `action` varchar(100) DEFAULT 'None',
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ticketApp_ticketid` (`ticketid`),
  KEY `idx_ticketApp_deptid` (`deptid`),
  KEY `idx_ticketApp_userid` (`userid`),
  KEY `idx_ticketApp_date` (`date`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticketapp`
--

LOCK TABLES `ticketapp` WRITE;
/*!40000 ALTER TABLE `ticketapp` DISABLE KEYS */;
INSERT INTO `ticketapp` VALUES (11,6,1,1,'None','None','2023-12-23'),(12,7,1,1,'None','None',NULL),(14,9,1,1,'None','None',NULL),(15,10,1,1,'None','None',NULL);
/*!40000 ALTER TABLE `ticketapp` ENABLE KEYS */;
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
