# Build Stage
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Copy the wrapper files first to cache dependencies
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle.kts settings.gradle.kts ./

# Copy source code
COPY src ./src

# Set execution permission and build
# Adding TLSv1.3 often fixes the bad_record_mac issue on modern JDKs
RUN chmod +x gradlew && \
    ./gradlew --no-daemon bootJar -Dhttps.protocols=TLSv1.2,TLSv1.3

# Runtime Stage
FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]