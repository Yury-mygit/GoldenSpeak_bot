# Use the official Nginx image
FROM nginx:latest

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config file
COPY /nginx/default.conf /etc/nginx/conf.d/

# (Optional) Copy static web content
# Uncomment the line below if you have static content to serve
# COPY html/ /var/www/html/

# Expose ports
EXPOSE 80 443

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]