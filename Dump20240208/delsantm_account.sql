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
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `aa` int(11) DEFAULT NULL,
  `ea` int(11) DEFAULT NULL,
  `ma` int(11) DEFAULT NULL,
  `ua` int(11) DEFAULT NULL,
  `deptid` int(11) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,'admin','Administrator','21232f297a57a5a743894a0e4a801fc3',1,1,1,1,0,1,'admintest@gmail.com'),(2,'srabor','Stephen Rabor','21232f297a57a5a743894a0e4a801fc3',1,1,0,0,0,1,'d@d'),(3,'sdasa','12312','21232f297a57a5a743894a0e4a801fc3',0,0,0,0,0,1,NULL),(4,'srabo1','stephen rabor','21232f297a57a5a743894a0e4a801fc3',1,0,0,0,0,9,'s@s'),(5,'eric','ericj','ec02c59dee6faaca3189bace969c22d3',1,0,0,0,0,9,NULL),(6,'tal','tal','c0079e0d4e801bc94bce6fa2ed9e008c',0,0,0,0,0,9,NULL),(8,'1231','1231','6c14da109e294d1e8155be8aa4b1ce8e',0,0,0,0,0,0,NULL),(9,'','','d41d8cd98f00b204e9800998ecf8427e',0,0,0,0,0,0,NULL),(12,'11231','1231','6c14da109e294d1e8155be8aa4b1ce8e',0,0,0,0,0,0,NULL),(13,'asdfa','asdfa','aa41efe0a1b3eeb9bf303e4561ff8392',0,0,0,0,0,0,NULL),(14,'123','1231','8d4646eb2d7067126eb08adb0672f7bb',0,0,0,0,0,0,NULL),(15,'1231231','1231','6c14da109e294d1e8155be8aa4b1ce8e',0,0,0,0,0,0,NULL),(16,'123sdf','2345','9b0f2299940d8b1e74156a589b8652bc',0,0,0,0,0,0,NULL),(18,'12312','','d41d8cd98f00b204e9800998ecf8427e',0,0,0,0,0,0,NULL),(19,'1234','123d','c8759924c3699fb35269dc39ba7fee56',1,0,0,0,0,8,NULL),(21,'12341231','12341','c8759924c3699fb35269dc39ba7fee56',0,0,0,0,0,11,'d@d'),(24,'1231asda','1231','f190ce9ac8445d249747cab7be43f7d5',0,0,0,0,0,11,'d@d'),(25,'123asdf','pends','48b600b1bf23fbbb535e6a3dd17106de',1,0,0,0,0,7,'d@d'),(26,'papa','asdd','a8f5f167f44f4964e6c998dee827110c',0,1,0,0,0,7,'d@d'),(27,'asdfasc','vx','f61b26d635309536c3c83c0adc3cb972',0,0,0,0,0,3,'asda@da'),(28,'one','two','5c0035865d854fce0896ef115666cdd8',0,0,0,0,0,3,'four@fd'),(29,'dasd','asasd','c68c9337f3f4bb131d3b0069e05aa4a6',0,0,0,0,0,9,'sdasda@dw'),(30,'aasdfa','asdfas','6e8f17a1cd2fd963d5843aca794e2287',0,0,0,0,0,8,'asdfa@d'),(31,'hoinest','sadas','8f4031bfc7640c5f267b11b6fe0c2507',0,0,0,0,0,8,'d@d'),(32,'baba','sdasda','59b466fd93164953e56bdd1358dc0044',0,0,0,0,0,1,'sdas@d'),(33,'dasda','unkwnod','7815696ecbf1c96e6894b779456d330e',0,0,0,0,0,1,'d@d'),(34,'tes1','test1','5a105e8b9d40e1329780d62ea2265d8a',1,0,0,0,0,1,'ste@d');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
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
