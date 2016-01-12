/* eslint-disable max-nested-callbacks */

'use strict';

var custom = ['custom', 'custom2', 'custom3'];

describe('KssSection object API', function() {
  before(function(done) {
    var self = this;
    helperUtils.traverseFixtures({mask: '*.less|*.css', custom: custom}, function(styleguide) {
      self.styleguide = styleguide;
      done();
    });
  });

  /* eslint-disable guard-for-in,no-loop-func */
  ['styleguide',
    'header',
    'description',
    'deprecated',
    'experimental',
    'reference',
    'referenceNumber',
    'referenceURI',
    'autoincrement',
    'weight',
    'depth',
    'markup',
    'modifiers',
    'parameters',
    'toJSON'
  ].forEach(function(method) {
    it('has ' + method + '() method', function(done) {
      expect(new kss.KssSection()).to.respondTo(method);
      done();
    });
  });
  /* eslint-enable guard-for-in,no-loop-func */

  describe('KssSection constructor', function() {
    it('should initialize the data', function(done) {
      var obj = new kss.KssSection();
      expect(obj).to.have.property('meta');
      expect(obj.meta).to.have.property('styleguide');
      expect(obj.meta).to.have.property('raw');
      expect(obj.meta).to.have.property('customPropertyNames');
      expect(obj.meta).to.have.property('depth');
      expect(obj).to.have.property('data');
      expect(obj.data).to.have.property('header');
      expect(obj.data).to.have.property('description');
      expect(obj.data).to.have.property('deprecated');
      expect(obj.data).to.have.property('experimental');
      expect(obj.data).to.have.property('reference');
      expect(obj.data).to.have.property('referenceURI');
      expect(obj.data).to.have.property('autoincrement');
      expect(obj.data).to.have.property('weight');
      expect(obj.data).to.have.property('markup');
      expect(obj.data).to.have.property('modifiers');
      expect(obj.data).to.have.property('parameters');
      done();
    });

    it('should return a KssSection object when called normally', function(done) {
      /* eslint-disable new-cap */
      var obj = kss.KssSection({header: 'Section'});
      expect(obj).to.be.an.instanceof(kss.KssSection);
      expect(obj.header()).to.equal('Section');
      done();
      /* eslint-enable new-cap */
    });

    it('should set itself as parent of modifier and parameter objects', function(done) {
      var section,
        modifier = new kss.KssModifier({name: 'modifier'}),
        parameter = new kss.KssParameter({name: '$parameter'});
      section = new kss.KssSection({
        header: 'Section',
        modifiers: [modifier],
        parameters: [parameter]
      });
      expect(modifier.section()).to.deep.equal(section);
      expect(parameter.section()).to.deep.equal(section);
      expect(section.modifiers()[0]).to.deep.equal(modifier);
      expect(section.parameters()[0]).to.deep.equal(parameter);
      done();
    });
  });

  describe('.toJSON()', function() {
    it('should return valid JSON object', function(done) {
      this.styleguide.data.sections.map(function(section) {
        var str;
        expect(section.toJSON()).to.be.an.instanceOf(Object);
        // Verify it converts to a JSON string.
        str = JSON.stringify(section.toJSON());
        expect(str).to.be.string;
        // Compare JSON string to original.
        expect(JSON.parse(str)).to.deep.equal(section.toJSON());
      });
      done();
    });

    it('should output the same data given to constructor', function(done) {
      // Note: no custom properties, please. (for testing code coverage.)
      var data, property, section;
      data = {
        header: 'example',
        description: 'lorem ipsum',
        reference: '1.1',
        markup: '<div class="example">lorem ipsum</div>'
      };
      section = new kss.KssSection(data);
      for (property in data) {
        if (data.hasOwnProperty(property)) {
          expect(section.toJSON()[property]).to.equal(data[property]);
        }
      }
      done();
    });

    it('should return custom properties', function(done) {
      this.styleguide.data.sections.map(function(section) {
        var json = section.toJSON();
        custom.map(function(name) {
          if (section.data[name]) {
            expect(json).to.have.property(name);
            expect(json[name]).to.equal(section.data[name]);
          }
        });
      });
      done();
    });
  });

  describe('.styleguide()', function() {
    it('should return meta.styleguide', function(done) {
      var self = this;
      this.styleguide.data.sections.map(function(section) {
        expect(section.styleguide()).to.deep.equal(section.meta.styleguide).and.deep.equal(self.styleguide);
      });
      done();
    });

    it('should set meta.styleguide if given a value', function(done) {
      var styleguide = new kss.KssStyleGuide(),
        section = new kss.KssSection({header: 'Section'});
      section.styleguide(styleguide);
      expect(section.meta.styleguide).to.deep.equal(styleguide);
      expect(section.styleguide()).to.deep.equal(section.meta.styleguide);
      done();
    });

    it('should return itself if given a value', function(done) {
      var styleguide = new kss.KssStyleGuide(),
        section = new kss.KssSection({header: 'Section'});
      expect(section.styleguide(styleguide)).to.deep.equal(section);
      done();
    });
  });

  describe('.header()', function() {
    it('should return data.header', function(done) {
      this.styleguide.data.sections.map(function(section) {
        expect(section.header()).to.equal(section.data.header);
      });
      done();
    });

    it('should set data.header if given a value', function(done) {
      var section = new kss.KssSection({header: 'original'});
      section.header('new');
      expect(section.data.header).to.equal('new');
      expect(section.header()).to.equal(section.data.header);
      done();
    });

    it('should return itself if given a value', function(done) {
      var section = new kss.KssSection({header: 'original'});
      expect(section.header('new')).to.deep.equal(section);
      done();
    });
  });

  describe('.description()', function() {
    it('should return data.description', function(done) {
      this.styleguide.data.sections.map(function(section) {
        expect(section.description()).to.equal(section.data.description);
      });
      done();
    });

    it('should set data.description if given a value', function(done) {
      var section = new kss.KssSection({description: 'original'});
      section.description('new');
      expect(section.data.description).to.equal('new');
      expect(section.description()).to.equal(section.data.description);
      done();
    });

    it('should return itself if given a value', function(done) {
      var section = new kss.KssSection({description: 'original'});
      expect(section.description('new')).to.deep.equal(section);
      done();
    });
  });

  describe('.deprecated()', function() {
    it('should return data.deprecated', function(done) {
      this.styleguide.data.sections.map(function(section) {
        expect(section.deprecated()).to.equal(section.data.deprecated);
      });
      done();
    });

    it('should set data.deprecated if given a value', function(done) {
      var section = new kss.KssSection({deprecated: false});
      expect(section.data.deprecated).to.equal(false);
      section.deprecated(true);
      expect(section.data.deprecated).to.equal(true);
      expect(section.deprecated()).to.equal(section.data.deprecated);
      done();
    });

    it('should return itself if given true', function(done) {
      var section = new kss.KssSection({deprecated: false});
      expect(section.deprecated(true)).to.deep.equal(section);
      done();
    });

    it('should return itself if given false', function(done) {
      var section = new kss.KssSection({deprecated: true});
      expect(section.deprecated(false)).to.deep.equal(section);
      done();
    });
  });

  describe('.experimental()', function() {
    it('should return data.experimental', function(done) {
      this.styleguide.data.sections.map(function(section) {
        expect(section.experimental()).to.equal(section.data.experimental);
      });
      done();
    });

    it('should set data.experimental if given a value', function(done) {
      var section = new kss.KssSection({experimental: false});
      expect(section.data.experimental).to.equal(false);
      section.experimental(true);
      expect(section.data.experimental).to.equal(true);
      expect(section.experimental()).to.equal(section.data.experimental);
      done();
    });

    it('should return itself if given true', function(done) {
      var section = new kss.KssSection({experimental: false});
      expect(section.experimental(true)).to.deep.equal(section);
      done();
    });

    it('should return itself if given false', function(done) {
      var section = new kss.KssSection({experimental: true});
      expect(section.experimental(false)).to.deep.equal(section);
      done();
    });
  });

  describe('.reference()', function() {
    it('should return data.reference', function(done) {
      this.styleguide.data.sections.map(function(section) {
        expect(section.reference()).to.equal(section.data.reference);
      });
      done();
    });

    it('should set data.reference if given a value', function(done) {
      var section = new kss.KssSection({reference: 'original'});
      section.reference('new');
      expect(section.data.reference).to.equal('new');
      expect(section.reference()).to.equal(section.data.reference);
      done();
    });

    it('should return itself if given a value', function(done) {
      var section = new kss.KssSection({reference: 'original'});
      expect(section.reference('new')).to.deep.equal(section);
      done();
    });
  });

  describe('.referenceURI()', function() {
    it('should return data.referenceURI', function(done) {
      this.styleguide.data.sections.map(function(section) {
        expect(section.referenceURI()).to.equal(section.data.referenceURI);
        expect(section.referenceURI()).to.equal(encodeURI(
          section.data.reference
            .replace(/ \- /g, '-')
            .replace(/[^\w-]+/g, '-')
            .toLowerCase()
        ));
      });
      done();
    });

    it('should replace all runs of non-word characters with a hyphen', function() {
      var section = new kss.KssSection({reference: 'test - section - with.multiple.runs..of--non-word.characters'});
      expect(section.referenceURI()).to.equal('test-section-with-multiple-runs-of--non-word-characters');
    });

    it('should set data.referenceURI if given a value', function(done) {
      var section = new kss.KssSection({reference: 'original.ref'});
      section.referenceURI('newRef');
      expect(section.data.referenceURI).to.equal('newRef');
      expect(section.referenceURI()).to.equal(section.data.referenceURI);
      done();
    });

    it('should return itself if given a value', function(done) {
      var section = new kss.KssSection({reference: 'original.ref'});
      expect(section.referenceURI('newRef')).to.deep.equal(section);
      done();
    });
  });

  describe('.weight()', function() {
    it('should return data.weight', function(done) {
      this.styleguide.data.sections.map(function(section) {
        expect(section.weight()).to.equal(section.data.weight);
        expect(section.weight()).to.be.at.least(-100000);
      });
      done();
    });

    it('should set data.weight if given a value', function(done) {
      var section = new kss.KssSection({weight: 2});
      section.weight(3);
      expect(section.data.weight).to.equal(3);
      expect(section.weight()).to.equal(section.data.weight);
      done();
    });

    it('should return itself if given a value', function(done) {
      var section = new kss.KssSection({weight: 2});
      expect(section.weight(3)).to.deep.equal(section);
      done();
    });
  });

  describe('.depth()', function() {
    it('should return meta.depth', function(done) {
      this.styleguide.data.sections.map(function(section) {
        expect(section.depth()).to.be.at.least(0);
        expect(section.depth()).to.equal(section.meta.depth);
        expect(section.depth()).to.equal(section.reference().split(section.styleguide().referenceDelimiter).length);
      });
      done();
    });

    it('should set meta.depth if given a value', function(done) {
      var section = new kss.KssSection({depth: 2});
      section.depth(3);
      expect(section.meta.depth).to.equal(3);
      expect(section.depth()).to.equal(section.meta.depth);
      done();
    });

    it('should return itself if given a value', function(done) {
      var section = new kss.KssSection({depth: 2});
      expect(section.depth(3)).to.deep.equal(section);
      done();
    });
  });

  describe('.markup()', function() {
    it('should return data.markup', function(done) {
      this.styleguide.data.sections.map(function(section) {
        expect(section.markup()).to.equal(section.data.markup);
      });
      done();
    });

    it('should set data.markup if given a value', function(done) {
      var section = new kss.KssSection({markup: 'original'});
      section.markup('new');
      expect(section.data.markup).to.equal('new');
      expect(section.markup()).to.equal(section.data.markup);
      done();
    });

    it('should return itself if given a value', function(done) {
      var section = new kss.KssSection({markup: 'original'});
      expect(section.markup('new')).to.deep.equal(section);
      done();
    });
  });

  describe('.modifiers()', function() {
    it('should return data.modifiers', function(done) {
      this.styleguide.data.sections.map(function(section) {
        expect(section.modifiers()).to.equal(section.data.modifiers);
      });
      done();
    });

    it('should return array of KssModifier', function(done) {
      this.styleguide.data.sections.map(function(section) {
        section.modifiers().map(function(modifier) {
          expect(modifier).to.be.instanceof(kss.KssModifier);
        });
      });
      done();
    });

    it('should return data.modifiers[n] given an integer as number or string', function(done) {
      this.styleguide.data.sections.map(function(section) {
        var i = 0;
        section.data.modifiers.map(function(modifier) {
          expect(section.modifiers(i)).to.deep.equal(modifier);
          expect(section.modifiers(i.toString())).to.deep.equal(modifier);
          i++;
        });
      });
      done();
    });

    it('should return false if number is not found', function(done) {
      this.styleguide.data.sections.map(function(section) {
        expect(section.modifiers(section.data.modifiers.length + 1)).to.be.false;
      });
      done();
    });

    it('should search by name when given a string', function(done) {
      this.styleguide.data.sections.map(function(section) {
        var i, j, queries = ['.red', '.yellow', ':hover', ':disabled'],
          q = queries.length,
          l = section.data.modifiers.length;

        // Loop through each modifier.
        for (i = 0; i < l; i += 1) {
          // If a modifier is equal to a query, run the search.
          for (j = 0; j < q; j += 1) {
            if (section.data.modifiers[i].data.name === queries[j]) {
              expect(section.modifiers(queries[j])).to.deep.equal(section.data.modifiers[i]);
            }
          }
        }
      });
      done();
    });

    it('should return false if name not found', function(done) {
      this.styleguide.data.sections.map(function(section) {
        expect(section.modifiers('__should_not_find___')).to.be.false;
      });
      done();
    });

    it('should add to data.modifiers if given a value', function(done) {
      var section = new kss.KssSection({header: 'original'}),
        modifier = new kss.KssModifier({name: '.modifier'});
      section.modifiers(modifier);
      expect(section.data.modifiers[0]).to.deep.equal(modifier);
      expect(section.modifiers()).to.equal(section.data.modifiers);
      done();
    });

    it('should add to data.modifiers if given an array of values', function(done) {
      var section = new kss.KssSection({header: 'original'}),
        modifier = new kss.KssModifier({name: '.modifier'}),
        modifier2 = new kss.KssModifier({name: '.modifier'});
      section.modifiers([modifier, modifier2]);
      expect(section.data.modifiers[0]).to.deep.equal(modifier);
      expect(section.data.modifiers[1]).to.deep.equal(modifier2);
      expect(section.modifiers()).to.equal(section.data.modifiers);
      done();
    });

    it('should return itself if given a value', function(done) {
      var section = new kss.KssSection({header: 'original'}),
        modifier = new kss.KssModifier();
      expect(section.modifiers(modifier)).to.deep.equal(section);
      done();
    });
  });

  describe('.parameters()', function() {
    it('should return data.parameters', function(done) {
      this.styleguide.data.sections.map(function(section) {
        expect(section.parameters()).to.equal(section.data.parameters);
      });
      done();
    });

    it('should return array of KssParameter', function(done) {
      this.styleguide.data.sections.map(function(section) {
        section.parameters().map(function(parameter) {
          expect(parameter).to.be.instanceof(kss.KssParameter);
        });
      });
      done();
    });

    it('should add to data.parameters if given a value', function(done) {
      var section = new kss.KssSection({header: 'original'}),
        parameter = new kss.KssParameter({name: '$var'});
      section.parameters(parameter);
      expect(section.data.parameters[0]).to.deep.equal(parameter);
      expect(section.parameters()).to.equal(section.data.parameters);
      done();
    });

    it('should add to data.parameters if given an array of values', function(done) {
      var section = new kss.KssSection({header: 'original'}),
        parameter = new kss.KssParameter({name: '$var1'}),
        parameter2 = new kss.KssParameter({name: '$var2'});
      section.parameters([parameter, parameter2]);
      expect(section.data.parameters[0]).to.deep.equal(parameter);
      expect(section.data.parameters[1]).to.deep.equal(parameter2);
      expect(section.parameters()).to.equal(section.data.parameters);
      done();
    });

    it('should return itself if given a value', function(done) {
      var section = new kss.KssSection({header: 'original'}),
        parameter = new kss.KssModifier();
      expect(section.parameters(parameter)).to.deep.equal(section);
      done();
    });
  });
});
