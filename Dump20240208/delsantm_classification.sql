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
-- Table structure for table `classification`
--

DROP TABLE IF EXISTS `classification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(15) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classification`
--

LOCK TABLES `classification` WRITE;
/*!40000 ALTER TABLE `classification` DISABLE KEYS */;
INSERT INTO `classification` VALUES (1,'class1','class1 desc'),(2,'Class2','class2 desc'),(3,'Class3','Class3 desc'),(21,'class12','1231231'),(33,'class1b','class1 desc'),(34,'no','1231'),(35,'yesas','1231'),(36,'testna','1231231'),(37,'baa','dccvbc'),(38,'ca1','cas'),(39,'aa','aa'),(40,'az','az'),(41,'class1123','asda'),(43,'testna123','asdadasda'),(44,'va','av'),(45,'za','za'),(46,'vaz','vasa'),(47,'b12az','baz'),(48,'ka','k'),(50,'classification ','class  two'),(51,'cla','1231'),(52,'a3','asda'),(53,'a4s','sdas'),(55,'noz','1231'),(56,'vxdadd','asda'),(57,'nami','dasda'),(58,'vas','dasda'),(60,'zad','asda'),(61,'asda','asda');
/*!40000 ALTER TABLE `classification` ENABLE KEYS */;
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
