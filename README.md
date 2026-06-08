# Yoga App

Application de réservation pour un studio de yoga. Projet OpenClassrooms axé sur les tests d'une application full-stack Java/Angular.

## Stack

- Back : Java 21, Spring Boot 3, MySQL
- Front : Angular 19, TypeScript
- Tests : JUnit/Mockito, Jest, Cypress

## Prérequis

- Java 21
- Maven 3.9+
- Node.js 18+
- Docker Desktop

## Lancer le projet

**Back** (port 8080) :

```bash
cd back
mvn spring-boot:run
```

**Front** (port 4200) :

```bash
cd front
npm install
ng serve
```

Identifiants admin de test : `yoga@studio.com` / `test!1234`

## Lancer les tests

**Back** :

```bash
cd back
mvn test
```

Rapport de couverture : `back/target/site/jacoco/index.html`

**Front** (unitaires + intégration) :

```bash
cd front
npm run test -- --coverage
```

Rapport de couverture : `front/coverage/lcov-report/index.html`

**E2E** (nécessite back et front lancés) :

```bash
cd front
npm run cypress:open
```

## Couverture

- Back : 94% instructions / 77% branches (DTO, models et payload exclus selon la consigne)
- Front : 98% instructions / 100% branches
