# Redis DB

# Estructura del Proyecto

    docker-compose.yml                               # Crea la red, imagenes y contenedores (RedisDB y Test_commands)
        ├─── redis                                   # RedisDB
        |      └─── redis.conf                       # Archivo de configuracion de RedisDB
        └─── test_commands                           # Servicio para realizar Testing sobre RedisDB.
               ├─── test                             # Carpeta de Test
               |      ├─── connection.test.js        # Testing de la conexion.
               |      ├─── commands.test.js          # Testing sobre comandos basicos (get, set, call, getBuffer, exists, keys
               |      ├─── command.hash.test.js      # Archivos de Test
               └─── Dockerfile.js                    # Acciones sobre el contenedor
