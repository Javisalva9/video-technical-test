
# Totally based on mvertes/docker-alpine-mongo
# We build it ourselves to pinpoint to specific alpine release
FROM  mongo:4.0.20@sha256:dd4cbe24eb8233db92b871cc556b77efcc7f9e67bc9516579796d4d08818273e

RUN mkdir -p /aws \
&& apt-get update \
&& apt-get -qq install --no-install-recommends --yes \
groff \
curl \
python \
unzip \
&& curl "https://d1vvhvl2y92vvt.cloudfront.net/awscli-exe-linux-x86_64.zip" \
-s \
-o "awscliv2.zip" \
&& unzip -q awscliv2.zip \
&& ./aws/install \
&& apt-get remove -y --purge unzip curl \
&& apt-get clean \
&& rm -f awscliv2.zip

ADD run.sh /src/run.sh

ENTRYPOINT ["/src/run.sh"]